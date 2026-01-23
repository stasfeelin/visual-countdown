import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, ArrowCounterClockwise, Clock, ArrowClockwise } from '@phosphor-icons/react'
import { CircularProgress } from '@/components/CircularProgress'
import { ColorPicker } from '@/components/ColorPicker'
import { TimeInput } from '@/components/TimeInput'
import { motion } from 'framer-motion'

type TimerState = 'setup' | 'running' | 'paused' | 'overtime'

function App() {
  const [hours, setHours] = useKV<number>('timer-hours', 0)
  const [minutes, setMinutes] = useKV<number>('timer-minutes', 5)
  const [seconds, setSeconds] = useKV<number>('timer-seconds', 0)
  const [selectedColor, setSelectedColor] = useKV<string>('timer-color', 'oklch(0.65 0.2 265)')
  
  const [timerState, setTimerState] = useState<TimerState>('setup')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [overtimeSeconds, setOvertimeSeconds] = useState(0)
  
  const intervalRef = useRef<number | null>(null)

  const urlParams = new URLSearchParams(window.location.search)
  const obsMode = urlParams.get('obs') === 'true'
  const autoStart = urlParams.get('autostart') === 'true'
  const urlMinutes = parseInt(urlParams.get('minutes') || '')
  const urlSeconds = parseInt(urlParams.get('seconds') || '')
  const urlHours = parseInt(urlParams.get('hours') || '')

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return {
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0')
    }
  }

  const startTimer = () => {
    const total = (hours ?? 0) * 3600 + (minutes ?? 0) * 60 + (seconds ?? 0)
    if (total === 0) return
    
    setTotalTime(total)
    setTimeRemaining(total)
    setTimerState('running')
  }

  const pauseTimer = () => {
    setTimerState('paused')
  }

  const resumeTimer = () => {
    setTimerState(timerState === 'overtime' ? 'overtime' : 'running')
  }

  const resetTimer = () => {
    setTimerState('setup')
    setTimeRemaining(0)
    setOvertimeSeconds(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const setPresetTimer = (presetMinutes: number) => {
    setHours(0)
    setMinutes(presetMinutes)
    setSeconds(0)
    
    const total = presetMinutes * 60
    setTotalTime(total)
    setTimeRemaining(total)
    setTimerState('running')
  }

  const restartTimer = () => {
    setOvertimeSeconds(0)
    setTimeRemaining(totalTime)
    setTimerState('running')
  }

  useEffect(() => {
    if (autoStart && !isNaN(urlMinutes)) {
      const h = !isNaN(urlHours) ? urlHours : 0
      const m = urlMinutes
      const s = !isNaN(urlSeconds) ? urlSeconds : 0
      
      setHours(h)
      setMinutes(m)
      setSeconds(s)
      
      const total = h * 3600 + m * 60 + s
      setTotalTime(total)
      setTimeRemaining(total)
      setTimerState('running')
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        if (timerState === 'setup') {
          startTimer()
        } else if (timerState === 'running' || timerState === 'overtime') {
          pauseTimer()
        } else if (timerState === 'paused') {
          resumeTimer()
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        if (timerState !== 'setup') {
          if (timerState === 'paused') {
            restartTimer()
          } else {
            restartTimer()
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        if (timerState !== 'setup') {
          resetTimer()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [timerState, hours, minutes, seconds])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (timerState === 'running') {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerState('overtime')
            setOvertimeSeconds(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerState === 'overtime') {
      intervalRef.current = window.setInterval(() => {
        setOvertimeSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [timerState])

  const percentage = timerState === 'overtime'
    ? Math.min((overtimeSeconds / totalTime) * 100, 100)
    : (timeRemaining / totalTime) * 100

  const isActive = timerState === 'running' || timerState === 'overtime'
  const isPaused = timerState === 'paused'
  const isSetup = timerState === 'setup'
  const isOvertime = timerState === 'overtime'

  const displayColor = isOvertime ? 'oklch(0.6 0.25 25)' : (selectedColor ?? 'oklch(0.65 0.2 265)')

  if (obsMode && timerState === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center space-y-4 p-8 bg-[oklch(0.15_0.02_265)]/95 backdrop-blur-sm rounded-xl border-2 border-[oklch(0.7_0.18_195)]/40 shadow-2xl">
          <h2 className="text-3xl font-bold text-[oklch(0.97_0.01_265)]">Timer Ready</h2>
          <p className="text-[oklch(0.85_0.01_265)] text-lg">Press SPACE to start</p>
          <div className="text-sm text-[oklch(0.7_0.02_265)] space-y-1 pt-2">
            <p><kbd className="px-2 py-1 bg-[oklch(0.22_0.025_265)] rounded font-mono text-[oklch(0.9_0.01_265)] border border-[oklch(0.35_0.03_265)]">SPACE</kbd> Start/Pause</p>
            <p><kbd className="px-2 py-1 bg-[oklch(0.22_0.025_265)] rounded font-mono text-[oklch(0.9_0.01_265)] border border-[oklch(0.35_0.03_265)]">R</kbd> Restart</p>
            <p><kbd className="px-2 py-1 bg-[oklch(0.22_0.025_265)] rounded font-mono text-[oklch(0.9_0.01_265)] border border-[oklch(0.35_0.03_265)]">ESC</kbd> Reset</p>
          </div>
        </div>
      </div>
    )
  }

  if (obsMode && timerState !== 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="relative">
          <CircularProgress
            key={isOvertime ? 'overtime' : 'normal'}
            percentage={percentage}
            color={displayColor}
            size={window.innerWidth < 640 ? 280 : 400}
            strokeWidth={21}
            isOvertime={isOvertime}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              animate={isOvertime ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <div
                className="font-mono font-bold tabular-nums flex items-center gap-2"
                style={{ 
                  fontSize: (() => {
                    const time = isOvertime ? formatTime(overtimeSeconds) : formatTime(timeRemaining)
                    return time.hours === '00' ? '5.5rem' : '4rem'
                  })(),
                  color: isOvertime ? 'oklch(0.97 0.01 265)' : 'oklch(0.97 0.01 265)',
                  textShadow: '0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,1), 0 8px 24px rgba(0,0,0,0.9)',
                  WebkitTextStroke: '1.5px rgba(0,0,0,0.5)',
                  filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.9))'
                }}
              >
                {(() => {
                  const time = isOvertime ? formatTime(overtimeSeconds) : formatTime(timeRemaining)
                  return (
                    <>
                      {time.hours !== '00' && (
                        <>
                          <span>{time.hours}</span>
                          <span className="opacity-60">:</span>
                        </>
                      )}
                      <span>{time.minutes}</span>
                      <span className="opacity-60">:</span>
                      <span>{time.seconds}</span>
                    </>
                  )
                })()}
              </div>
              {isOvertime && (
                <div 
                  className="text-base font-bold uppercase tracking-wider mt-3"
                  style={{
                    color: 'oklch(0.85 0.22 25)',
                    textShadow: '0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,1)',
                    WebkitTextStroke: '1px rgba(0,0,0,0.5)',
                    filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.9))'
                  }}
                >
                  Overtime
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[oklch(0.15_0.02_265)] via-[oklch(0.18_0.025_265)] to-[oklch(0.12_0.015_265)]">
      <Card className="w-full max-w-2xl p-8 md:p-12 shadow-2xl border-[oklch(0.35_0.03_265)]">
        {isSetup ? (
          <div className="flex flex-col items-center gap-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Countdown Timer</h1>
              <p className="text-muted-foreground">Set your timer and choose a color</p>
            </div>

            <div className="w-full max-w-md space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-center text-muted-foreground uppercase tracking-wide">Quick Presets</p>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => setPresetTimer(5)}
                    variant="outline"
                    size="lg"
                    className="flex flex-col gap-1 h-auto py-4"
                  >
                    <Clock size={24} />
                    <span className="font-semibold">5 min</span>
                  </Button>
                  <Button
                    onClick={() => setPresetTimer(15)}
                    variant="outline"
                    size="lg"
                    className="flex flex-col gap-1 h-auto py-4"
                  >
                    <Clock size={24} />
                    <span className="font-semibold">15 min</span>
                  </Button>
                  <Button
                    onClick={() => setPresetTimer(25)}
                    variant="outline"
                    size="lg"
                    className="flex flex-col gap-1 h-auto py-4"
                  >
                    <Clock size={24} />
                    <span className="font-semibold">25 min</span>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or customize</span>
                </div>
              </div>
            </div>

            <TimeInput
              hours={hours ?? 0}
              minutes={minutes ?? 0}
              seconds={seconds ?? 0}
              onHoursChange={setHours}
              onMinutesChange={setMinutes}
              onSecondsChange={setSeconds}
            />

            <div className="w-full max-w-xs space-y-4">
              <ColorPicker
                selectedColor={selectedColor ?? 'oklch(0.65 0.2 265)'}
                onColorChange={setSelectedColor}
              />
              
              <Button
                onClick={startTimer}
                disabled={(hours ?? 0) === 0 && (minutes ?? 0) === 0 && (seconds ?? 0) === 0}
                size="lg"
                className="w-full uppercase tracking-wider font-semibold"
              >
                <Play size={20} weight="fill" />
                Start Timer
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  💡 Use <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono border border-border">SPACE</kbd> to start
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6 w-full">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground text-center hover:text-foreground transition-colors">
                  <span className="inline-flex items-center gap-2">
                    OBS Integration & Shortcuts
                    <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-2 border border-border">
                    <p className="font-semibold text-foreground">Keyboard Shortcuts:</p>
                    <ul className="space-y-1 text-xs">
                      <li><kbd className="px-1.5 py-0.5 bg-background rounded font-mono border border-border">SPACE</kbd> - Start / Pause / Resume</li>
                      <li><kbd className="px-1.5 py-0.5 bg-background rounded font-mono border border-border">R</kbd> - Restart timer</li>
                      <li><kbd className="px-1.5 py-0.5 bg-background rounded font-mono border border-border">ESC</kbd> - Reset to setup</li>
                    </ul>
                  </div>
                  <div className="bg-accent/20 rounded-lg p-4 space-y-2 border border-accent/30">
                    <p className="font-semibold text-foreground">OBS Browser Source:</p>
                    <p className="text-xs">Add <code className="px-1.5 py-0.5 bg-background rounded font-mono text-accent border border-accent/30">?obs=true</code> to the URL for transparent overlay mode.</p>
                    <p className="text-xs">Example: <code className="px-1 py-0.5 bg-background rounded font-mono text-accent text-[10px] break-all border border-accent/30">?obs=true&minutes=25&autostart=true</code></p>
                    <a 
                      href="/OBS_GUIDE.md" 
                      target="_blank"
                      className="text-xs text-accent hover:underline inline-block mt-1"
                    >
                      View full OBS integration guide →
                    </a>
                  </div>
                </div>
              </details>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <CircularProgress
                key={isOvertime ? 'overtime' : 'normal'}
                percentage={percentage}
                color={displayColor}
                size={window.innerWidth < 640 ? 280 : 400}
                strokeWidth={18}
                isOvertime={isOvertime}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  animate={isOvertime ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="font-mono font-bold tabular-nums flex items-center gap-2"
                    style={{ 
                      fontSize: (() => {
                        const time = isOvertime ? formatTime(overtimeSeconds) : formatTime(timeRemaining)
                        return time.hours === '00' ? '5.5rem' : '3.75rem'
                      })(),
                      color: isOvertime ? 'oklch(0.85 0.22 25)' : 'oklch(0.97 0.01 265)' 
                    }}
                  >
                    {(() => {
                      const time = isOvertime ? formatTime(overtimeSeconds) : formatTime(timeRemaining)
                      return (
                        <>
                          {time.hours !== '00' && (
                            <>
                              <span>{time.hours}</span>
                              <span className="opacity-60">:</span>
                            </>
                          )}
                          <span>{time.minutes}</span>
                          <span className="opacity-60">:</span>
                          <span>{time.seconds}</span>
                        </>
                      )
                    })()}
                  </div>
                  {isOvertime && (
                    <div className="text-base font-bold uppercase tracking-wider mt-3 text-[oklch(0.85_0.22_25)]">
                      Overtime
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={isActive ? pauseTimer : resumeTimer}
                size="lg"
                variant="default"
                className="min-w-32"
              >
                {isActive ? (
                  <>
                    <Pause size={20} weight="fill" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={20} weight="fill" />
                    Resume
                  </>
                )}
              </Button>
              <Button
                onClick={restartTimer}
                size="lg"
                variant="outline"
              >
                <ArrowClockwise size={20} />
                Restart
              </Button>
              <Button
                onClick={resetTimer}
                size="lg"
                variant="outline"
              >
                <ArrowCounterClockwise size={20} />
                Reset
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono border border-border">SPACE</kbd> Pause · 
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono mx-1 border border-border">R</kbd> Restart · 
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono border border-border">ESC</kbd> Reset
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default App