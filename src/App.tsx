import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, ArrowCounterClockwise, Clock } from '@phosphor-icons/react'
import { CircularProgress } from '@/components/CircularProgress'
import { ColorPicker } from '@/components/ColorPicker'
import { TimeInput } from '@/components/TimeInput'
import { motion } from 'framer-motion'

type TimerState = 'setup' | 'running' | 'paused' | 'overtime'

function App() {
  const [hours, setHours] = useKV<number>('timer-hours', 0)
  const [minutes, setMinutes] = useKV<number>('timer-minutes', 5)
  const [seconds, setSeconds] = useKV<number>('timer-seconds', 0)
  const [selectedColor, setSelectedColor] = useKV<string>('timer-color', 'oklch(0.55 0.2 285)')
  
  const [timerState, setTimerState] = useState<TimerState>('setup')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [overtimeSeconds, setOvertimeSeconds] = useState(0)
  
  const intervalRef = useRef<number | null>(null)

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
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
  }

  useEffect(() => {
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
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
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

  const displayColor = isOvertime ? 'oklch(0.55 0.22 25)' : (selectedColor ?? 'oklch(0.55 0.2 285)')

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-secondary">
      <Card className="w-full max-w-2xl p-8 md:p-12 shadow-2xl">
        {isSetup ? (
          <div className="flex flex-col items-center gap-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Countdown Timer</h1>
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
                selectedColor={selectedColor ?? 'oklch(0.55 0.2 285)'}
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
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <CircularProgress
                percentage={percentage}
                color={displayColor}
                size={window.innerWidth < 640 ? 280 : 400}
                strokeWidth={12}
                isOvertime={isOvertime}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  animate={isOvertime ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="font-mono font-bold tabular-nums text-5xl md:text-7xl"
                    style={{ color: isOvertime ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.02 265)' }}
                  >
                    {isOvertime ? formatTime(overtimeSeconds) : formatTime(timeRemaining)}
                  </div>
                  {isOvertime && (
                    <div className="text-sm font-semibold uppercase tracking-wider mt-2 text-destructive">
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
                onClick={resetTimer}
                size="lg"
                variant="outline"
              >
                <ArrowCounterClockwise size={20} />
                Reset
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default App