import { useEffect, useRef, useState } from 'react'
import { ArrowClockwise, ArrowCounterClockwise, Clock, Pause, Play } from '@phosphor-icons/react'
import { Keyboard, Monitor, Palette, Sparkles, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CircularProgress } from '@/components/CircularProgress'
import { ColorPicker } from '@/components/ColorPicker'
import { TimeInput } from '@/components/TimeInput'
import { ThemePicker, THEMES, type Theme } from '@/components/ThemePicker'
import { usePersistentState } from '@/hooks/use-persistent-state'

import { motion } from 'framer-motion'

type TimerState = 'setup' | 'running' | 'paused' | 'overtime'

const PRESET_OPTIONS = [
  { minutes: 5, label: 'Quick reset', caption: 'Short break' },
  { minutes: 15, label: 'Sprint session', caption: 'Focused push' },
  { minutes: 25, label: 'Deep work', caption: 'Pomodoro default' },
]

function mixColor(color: string, opacity: number) {
  return `color-mix(in oklab, ${color} ${Math.round(opacity * 100)}%, transparent)`
}

function App() {
  const [hours, setHours] = usePersistentState<number>('timer-hours', 0)
  const [minutes, setMinutes] = usePersistentState<number>('timer-minutes', 5)
  const [seconds, setSeconds] = usePersistentState<number>('timer-seconds', 0)
  const [selectedColor, setSelectedColor] = usePersistentState<string>('timer-color', 'oklch(0.65 0.2 265)')
  const [selectedThemeId, setSelectedThemeId] = usePersistentState<string>('timer-theme', 'dark-purple')

  const [timerState, setTimerState] = useState<TimerState>('setup')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [overtimeSeconds, setOvertimeSeconds] = useState(0)

  const intervalRef = useRef<number | null>(null)

  const currentTheme = THEMES.find((theme) => theme.id === selectedThemeId) || THEMES[0]
  const accentColor = selectedColor ?? 'oklch(0.65 0.2 265)'
  const configuredTotal = (hours ?? 0) * 3600 + (minutes ?? 0) * 60 + (seconds ?? 0)
  const previewSeconds = configuredTotal || 25 * 60
  const activeSeconds = timerState === 'overtime' ? overtimeSeconds : timeRemaining
  const timeForDisplay = formatTime(activeSeconds)
  const previewTime = formatTime(previewSeconds)

  const urlParams = new URLSearchParams(window.location.search)
  const obsMode = urlParams.get('obs') === 'true'
  const autoStart = urlParams.get('autostart') === 'true'
  const urlMinutes = parseInt(urlParams.get('minutes') || '')
  const urlSeconds = parseInt(urlParams.get('seconds') || '')
  const urlHours = parseInt(urlParams.get('hours') || '')
  const timerSize = window.innerWidth < 640 ? 280 : 400
  const obsGuideHref = `${import.meta.env.BASE_URL}OBS_GUIDE.md`

  const shellStyle = {
    background: `
      radial-gradient(circle at 12% 18%, ${mixColor(accentColor, 0.28)} 0%, transparent 32%),
      radial-gradient(circle at 88% 14%, ${mixColor(currentTheme.cardForeground, 0.14)} 0%, transparent 28%),
      radial-gradient(circle at 50% 100%, ${mixColor(currentTheme.background, 0.95)} 0%, ${currentTheme.background} 55%)
    `,
  }

  const cardStyle = {
    background: `linear-gradient(145deg, ${mixColor(currentTheme.card, 0.88)} 0%, ${mixColor(currentTheme.background, 0.72)} 100%)`,
    borderColor: mixColor(currentTheme.cardForeground, 0.14),
    boxShadow: `0 50px 140px -70px ${mixColor(accentColor, 0.75)}`,
  }

  const panelStyle = {
    background: `linear-gradient(180deg, ${mixColor(currentTheme.background, 0.42)} 0%, ${mixColor(currentTheme.background, 0.2)} 100%)`,
    borderColor: mixColor(currentTheme.cardForeground, 0.12),
  }

  const accentPanelStyle = {
    background: `linear-gradient(180deg, ${mixColor(accentColor, 0.18)} 0%, ${mixColor(currentTheme.background, 0.22)} 100%)`,
    borderColor: mixColor(accentColor, 0.22),
  }

  const primaryButtonStyle = {
    background: `linear-gradient(135deg, ${accentColor} 0%, ${mixColor(accentColor, 0.75)} 100%)`,
    boxShadow: `0 24px 40px -24px ${mixColor(accentColor, 0.9)}`,
  }

  const shortcutClass =
    'inline-flex min-w-10 items-center justify-center rounded-full border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.24em]'

  const actionButtonClass =
    'h-14 rounded-full border px-6 text-sm font-semibold tracking-[0.24em] uppercase shadow-[0_20px_50px_-28px_rgba(15,23,42,0.65)] transition duration-300 hover:-translate-y-0.5'

  function formatTime(totalSeconds: number) {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60

    return {
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
    }
  }

  const handleThemeChange = (theme: Theme) => {
    setSelectedThemeId(theme.id)
  }

  const startTimer = () => {
    const total = (hours ?? 0) * 3600 + (minutes ?? 0) * 60 + (seconds ?? 0)
    if (total === 0) {
      return
    }

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
    const total = (hours ?? 0) * 3600 + (minutes ?? 0) * 60 + (seconds ?? 0)
    setTimeRemaining(total)
    setOvertimeSeconds(0)
    setTimerState('setup')

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
    setTimerState('paused')
  }

  useEffect(() => {
    if (autoStart && !isNaN(urlMinutes)) {
      const parsedHours = !isNaN(urlHours) ? urlHours : 0
      const parsedMinutes = urlMinutes
      const parsedSeconds = !isNaN(urlSeconds) ? urlSeconds : 0

      setHours(parsedHours)
      setMinutes(parsedMinutes)
      setSeconds(parsedSeconds)

      const total = parsedHours * 3600 + parsedMinutes * 60 + parsedSeconds
      setTotalTime(total)
      setTimeRemaining(total)
      setTimerState('running')
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault()
        if (timerState === 'setup') {
          startTimer()
        } else if (timerState === 'running' || timerState === 'overtime') {
          pauseTimer()
        } else if (timerState === 'paused') {
          resumeTimer()
        }
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault()
        if (timerState !== 'setup') {
          restartTimer()
        }
      } else if (event.key === 'Escape') {
        event.preventDefault()
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
        setTimeRemaining((previous) => {
          if (previous <= 1) {
            setTimerState('overtime')
            setOvertimeSeconds(0)
            return 0
          }

          return previous - 1
        })
      }, 1000)
    } else if (timerState === 'overtime') {
      intervalRef.current = window.setInterval(() => {
        setOvertimeSeconds((previous) => previous + 1)
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [timerState])

  const percentage = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0
  const overtimePercentage = totalTime > 0 ? Math.min((overtimeSeconds / totalTime) * 100, 100) : 0

  const isActive = timerState === 'running' || timerState === 'overtime'
  const isSetup = timerState === 'setup'
  const isOvertime = timerState === 'overtime'

  if (obsMode && timerState === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div
          className="space-y-5 rounded-[28px] border px-8 py-7 text-center shadow-2xl backdrop-blur-xl"
          style={{
            background: `linear-gradient(180deg, ${mixColor(currentTheme.card, 0.86)} 0%, ${mixColor(currentTheme.background, 0.58)} 100%)`,
            borderColor: mixColor(accentColor, 0.35),
            boxShadow: `0 35px 80px -50px ${mixColor(accentColor, 0.9)}`,
          }}
        >
          <div
            className="mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
            style={{
              borderColor: mixColor(accentColor, 0.36),
              backgroundColor: mixColor(accentColor, 0.16),
              color: currentTheme.timerColor,
            }}
          >
            <Monitor size={14} />
            OBS ready
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight" style={{ color: currentTheme.timerColor }}>
              Timer ready
            </h2>
            <p className="text-base" style={{ color: mixColor(currentTheme.cardForeground, 0.78) }}>
              Press SPACE to launch the countdown overlay.
            </p>
          </div>
          <div className="grid gap-2 text-sm" style={{ color: mixColor(currentTheme.cardForeground, 0.76) }}>
            {[
              ['SPACE', 'Start or pause'],
              ['R', 'Restart current session'],
              ['ESC', 'Return to setup'],
            ].map(([key, description]) => (
              <div key={key} className="flex items-center justify-center gap-3">
                <span
                  className={shortcutClass}
                  style={{
                    backgroundColor: mixColor(currentTheme.background, 0.85),
                    borderColor: mixColor(currentTheme.foreground, 0.16),
                    color: currentTheme.foreground,
                  }}
                >
                  {key}
                </span>
                <span>{description}</span>
              </div>
            ))}
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
            percentage={percentage}
            color={accentColor}
            size={timerSize}
            strokeWidth={21}
            isOvertime={isOvertime}
            overtimePercentage={overtimePercentage}
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
                  fontSize: timeForDisplay.hours === '00' ? '5.5rem' : '4rem',
                  color: isOvertime ? 'oklch(0.97 0.01 265)' : currentTheme.timerColor,
                  textShadow:
                    '0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,1), 0 8px 24px rgba(0,0,0,0.9)',
                  WebkitTextStroke: '1.5px rgba(0,0,0,0.5)',
                  filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.9))',
                }}
              >
                {timeForDisplay.hours !== '00' && (
                  <>
                    <span>{timeForDisplay.hours}</span>
                    <span className="opacity-60">:</span>
                  </>
                )}
                <span>{timeForDisplay.minutes}</span>
                <span className="opacity-60">:</span>
                <span>{timeForDisplay.seconds}</span>
              </div>
              {isOvertime && (
                <div
                  className="text-base font-bold uppercase tracking-[0.3em] mt-3"
                  style={{
                    color: 'oklch(0.85 0.22 25)',
                    textShadow: '0 0 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,1)',
                    WebkitTextStroke: '1px rgba(0,0,0,0.5)',
                    filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.9))',
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
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10" style={shellStyle}>
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
        <Card
          className="w-full overflow-hidden rounded-[32px] border px-5 py-5 shadow-[0_60px_140px_-70px_rgba(15,23,42,0.85)] backdrop-blur-2xl sm:px-7 sm:py-7"
          style={cardStyle}
        >
          {isSetup ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <section className="flex flex-col gap-6 sm:gap-8">
                <div className="space-y-5">
                  <div
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
                    style={{
                      borderColor: mixColor(accentColor, 0.3),
                      backgroundColor: mixColor(accentColor, 0.12),
                      color: currentTheme.timerColor,
                    }}
                  >
                    <Sparkles size={14} />
                    Premium countdown portal
                  </div>
                  <div className="space-y-4">
                    <h1
                      className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl xl:text-6xl"
                      style={{ color: currentTheme.cardForeground }}
                    >
                      Visual Countdown
                    </h1>
                    <p
                      className="max-w-2xl text-base leading-7 sm:text-lg"
                      style={{ color: mixColor(currentTheme.cardForeground, 0.72) }}
                    >
                      A polished timer experience for streams, launches, workshops, and on-screen portals. Fast presets,
                      clean overlays, premium themes, and keyboard control are all built in.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { icon: Monitor, label: 'OBS overlay ready' },
                      { icon: Keyboard, label: 'Keyboard driven' },
                      { icon: Palette, label: 'Custom themes' },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
                        style={{
                          borderColor: mixColor(currentTheme.cardForeground, 0.1),
                          backgroundColor: mixColor(currentTheme.background, 0.34),
                          color: mixColor(currentTheme.cardForeground, 0.8),
                        }}
                      >
                        <Icon size={16} />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.84fr)]">
                  <div className="rounded-[28px] border p-5 sm:p-6" style={panelStyle}>
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.28em]"
                          style={{ color: mixColor(currentTheme.cardForeground, 0.54) }}
                        >
                          Quick launch
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold" style={{ color: currentTheme.cardForeground }}>
                          Start with a premium preset
                        </h2>
                      </div>
                      <div
                        className="hidden rounded-full border px-3 py-1 text-xs font-medium sm:inline-flex"
                        style={{
                          borderColor: mixColor(accentColor, 0.28),
                          backgroundColor: mixColor(accentColor, 0.12),
                          color: currentTheme.timerColor,
                        }}
                      >
                        <Zap size={14} className="mr-2" />
                        Instant
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {PRESET_OPTIONS.map((preset) => (
                        <Button
                          key={preset.minutes}
                          onClick={() => setPresetTimer(preset.minutes)}
                          variant="outline"
                          size="lg"
                          className="h-auto min-h-28 flex-col items-start rounded-[24px] px-5 py-5 text-left backdrop-blur-xl"
                          style={{
                            background: `linear-gradient(180deg, ${mixColor(currentTheme.background, 0.5)} 0%, ${mixColor(accentColor, 0.08)} 100%)`,
                            borderColor: mixColor(currentTheme.cardForeground, 0.1),
                          }}
                        >
                          <span className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: mixColor(currentTheme.cardForeground, 0.48) }}>
                            {preset.caption}
                          </span>
                          <span className="text-3xl font-semibold tracking-[-0.04em]" style={{ color: currentTheme.cardForeground }}>
                            {String(preset.minutes).padStart(2, '0')}
                            <span className="ml-1 text-base font-medium opacity-65">min</span>
                          </span>
                          <span className="text-sm" style={{ color: mixColor(currentTheme.cardForeground, 0.72) }}>
                            {preset.label}
                          </span>
                        </Button>
                      ))}
                    </div>

                    <div className="my-6 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${mixColor(currentTheme.cardForeground, 0.14)}, transparent)` }} />

                    <div className="space-y-5">
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.28em]"
                          style={{ color: mixColor(currentTheme.cardForeground, 0.54) }}
                        >
                          Custom duration
                        </p>
                        <p className="mt-2 text-sm leading-6" style={{ color: mixColor(currentTheme.cardForeground, 0.72) }}>
                          Dial in an exact countdown for presentations, breaks, workshops, or launches.
                        </p>
                      </div>

                      <TimeInput
                        hours={hours ?? 0}
                        minutes={minutes ?? 0}
                        seconds={seconds ?? 0}
                        onHoursChange={setHours}
                        onMinutesChange={setMinutes}
                        onSecondsChange={setSeconds}
                      />

                      <Button
                        onClick={startTimer}
                        disabled={configuredTotal === 0}
                        size="lg"
                        className="h-14 w-full rounded-full border-0 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] transition hover:-translate-y-0.5"
                        style={primaryButtonStyle}
                      >
                        <Play size={18} weight="fill" />
                        Start timer
                      </Button>

                      <p className="text-center text-xs" style={{ color: mixColor(currentTheme.cardForeground, 0.6) }}>
                        Press{' '}
                        <span
                          className={shortcutClass}
                          style={{
                            backgroundColor: mixColor(currentTheme.background, 0.75),
                            borderColor: mixColor(currentTheme.cardForeground, 0.12),
                            color: currentTheme.cardForeground,
                          }}
                        >
                          SPACE
                        </span>{' '}
                        to launch instantly
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[28px] border p-5 sm:p-6" style={panelStyle}>
                      <p
                        className="text-xs font-semibold uppercase tracking-[0.28em]"
                        style={{ color: mixColor(currentTheme.cardForeground, 0.54) }}
                      >
                        Look & feel
                      </p>
                      <div className="mt-4 space-y-4">
                        <ThemePicker selectedThemeId={selectedThemeId ?? 'dark-purple'} onThemeChange={handleThemeChange} />
                        <ColorPicker selectedColor={accentColor} onColorChange={setSelectedColor} />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                      {[
                        { label: 'Persistence', value: 'Browser memory', icon: Sparkles },
                        { label: 'Overlay mode', value: '?obs=true', icon: Monitor },
                        { label: 'Auto-start', value: '&autostart=true', icon: Zap },
                      ].map(({ label, value, icon: Icon }) => (
                        <div
                          key={label}
                          className="rounded-[24px] border p-4"
                          style={{
                            ...panelStyle,
                            background: `linear-gradient(180deg, ${mixColor(currentTheme.background, 0.36)} 0%, ${mixColor(accentColor, 0.08)} 100%)`,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="flex size-10 items-center justify-center rounded-2xl border"
                              style={{
                                borderColor: mixColor(accentColor, 0.25),
                                backgroundColor: mixColor(accentColor, 0.14),
                                color: currentTheme.timerColor,
                              }}
                            >
                              <Icon size={18} />
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em]" style={{ color: mixColor(currentTheme.cardForeground, 0.5) }}>
                                {label}
                              </p>
                              <p className="mt-1 text-sm font-medium" style={{ color: currentTheme.cardForeground }}>
                                {value}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <aside className="flex flex-col gap-4 sm:gap-5">
                <div className="rounded-[32px] border p-5 sm:p-6" style={accentPanelStyle}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-[0.28em]"
                        style={{ color: mixColor(currentTheme.cardForeground, 0.54) }}
                      >
                        Live preview
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold" style={{ color: currentTheme.cardForeground }}>
                        What your audience sees
                      </h2>
                    </div>
                    <div
                      className="rounded-full border px-3 py-1 text-xs font-medium"
                      style={{
                        borderColor: mixColor(currentTheme.cardForeground, 0.12),
                        backgroundColor: mixColor(currentTheme.background, 0.36),
                        color: mixColor(currentTheme.cardForeground, 0.78),
                      }}
                    >
                      Setup mode
                    </div>
                  </div>

                  <div className="relative mt-8 flex items-center justify-center">
                    <div
                      className="absolute size-[78%] rounded-full blur-3xl"
                      style={{ background: `radial-gradient(circle, ${mixColor(accentColor, 0.26)} 0%, transparent 72%)` }}
                    />
                    <div className="relative">
                      <CircularProgress percentage={100} color={accentColor} size={timerSize} strokeWidth={18} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div
                            className="font-mono text-[3.25rem] font-bold tabular-nums tracking-[-0.04em] sm:text-[4rem]"
                            style={{ color: currentTheme.timerColor }}
                          >
                            {previewTime.hours !== '00' && (
                              <>
                                {previewTime.hours}
                                <span className="opacity-55">:</span>
                              </>
                            )}
                            {previewTime.minutes}
                            <span className="opacity-55">:</span>
                            {previewTime.seconds}
                          </div>
                          <p className="mt-3 text-xs uppercase tracking-[0.3em]" style={{ color: mixColor(currentTheme.cardForeground, 0.58) }}>
                            Countdown ready
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div
                      className="rounded-[22px] border p-4"
                      style={{
                        borderColor: mixColor(currentTheme.cardForeground, 0.1),
                        backgroundColor: mixColor(currentTheme.background, 0.38),
                      }}
                    >
                      <p className="text-xs uppercase tracking-[0.24em]" style={{ color: mixColor(currentTheme.cardForeground, 0.48) }}>
                        Selected theme
                      </p>
                      <p className="mt-2 text-lg font-semibold" style={{ color: currentTheme.cardForeground }}>
                        {currentTheme.name}
                      </p>
                    </div>
                    <div
                      className="rounded-[22px] border p-4"
                      style={{
                        borderColor: mixColor(accentColor, 0.26),
                        backgroundColor: mixColor(accentColor, 0.12),
                      }}
                    >
                      <p className="text-xs uppercase tracking-[0.24em]" style={{ color: mixColor(currentTheme.cardForeground, 0.48) }}>
                        Accent tone
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="size-6 rounded-full border" style={{ backgroundColor: accentColor, borderColor: mixColor(currentTheme.cardForeground, 0.16) }} />
                        <p className="text-lg font-semibold" style={{ color: currentTheme.cardForeground }}>
                          Signature glow
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border p-5 sm:p-6" style={panelStyle}>
                  <details className="group">
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p
                            className="text-xs font-semibold uppercase tracking-[0.28em]"
                            style={{ color: mixColor(currentTheme.cardForeground, 0.54) }}
                          >
                            Operator guide
                          </p>
                          <p className="mt-2 text-lg font-semibold" style={{ color: currentTheme.cardForeground }}>
                            OBS setup & keyboard shortcuts
                          </p>
                        </div>
                        <div
                          className="rounded-full border px-3 py-1 text-xs font-medium transition group-open:rotate-180"
                          style={{
                            borderColor: mixColor(currentTheme.cardForeground, 0.1),
                            backgroundColor: mixColor(currentTheme.background, 0.34),
                            color: currentTheme.cardForeground,
                          }}
                        >
                          v
                        </div>
                      </div>
                    </summary>

                    <div className="mt-5 space-y-4">
                      <div
                        className="rounded-[22px] border p-4"
                        style={{
                          borderColor: mixColor(currentTheme.cardForeground, 0.1),
                          backgroundColor: mixColor(currentTheme.background, 0.34),
                        }}
                      >
                        <p className="mb-3 text-sm font-semibold" style={{ color: currentTheme.cardForeground }}>
                          Keyboard shortcuts
                        </p>
                        <div className="grid gap-3 text-sm" style={{ color: mixColor(currentTheme.cardForeground, 0.72) }}>
                          {[
                            ['SPACE', 'Start, pause, resume'],
                            ['R', 'Restart current timer'],
                            ['ESC', 'Return to setup'],
                          ].map(([key, description]) => (
                            <div key={key} className="flex items-center gap-3">
                              <span
                                className={shortcutClass}
                                style={{
                                  backgroundColor: mixColor(currentTheme.card, 0.84),
                                  borderColor: mixColor(currentTheme.cardForeground, 0.12),
                                  color: currentTheme.cardForeground,
                                }}
                              >
                                {key}
                              </span>
                              <span>{description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div
                        className="rounded-[22px] border p-4"
                        style={{
                          borderColor: mixColor(accentColor, 0.22),
                          background: `linear-gradient(180deg, ${mixColor(accentColor, 0.16)} 0%, ${mixColor(currentTheme.background, 0.32)} 100%)`,
                        }}
                      >
                        <p className="mb-2 text-sm font-semibold" style={{ color: currentTheme.cardForeground }}>
                          Browser source URL
                        </p>
                        <code
                          className="block rounded-2xl border px-4 py-3 text-xs leading-6 break-all"
                          style={{
                            borderColor: mixColor(accentColor, 0.24),
                            backgroundColor: mixColor(currentTheme.card, 0.76),
                            color: currentTheme.timerColor,
                          }}
                        >
                          ?obs=true&minutes=25&autostart=true
                        </code>
                        <a
                          href={obsGuideHref}
                          target="_blank"
                          className="mt-3 inline-flex text-sm font-medium hover:opacity-80"
                          style={{ color: accentColor }}
                        >
                          View full OBS integration guide →
                        </a>
                      </div>
                    </div>
                  </details>
                </div>
              </aside>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-center">
              <section
                className="rounded-[32px] border p-5 sm:p-7"
                style={isOvertime ? accentPanelStyle : panelStyle}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
                    style={{
                      borderColor: mixColor(isOvertime ? 'oklch(0.85 0.22 25)' : accentColor, 0.3),
                      backgroundColor: mixColor(isOvertime ? 'oklch(0.85 0.22 25)' : accentColor, 0.14),
                      color: isOvertime ? 'oklch(0.92 0.02 25)' : currentTheme.timerColor,
                    }}
                  >
                    {isOvertime ? <Zap size={14} /> : <Clock size={14} />}
                    {isOvertime ? 'Overtime' : isActive ? 'Live countdown' : 'Paused'}
                  </div>
                  <p className="text-sm" style={{ color: mixColor(currentTheme.cardForeground, 0.66) }}>
                    {isOvertime ? 'Tracking overrun' : isActive ? 'Session in progress' : 'Ready to resume'}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center justify-center">
                  <div
                    className="absolute size-[78%] rounded-full blur-3xl"
                    style={{
                      background: `radial-gradient(circle, ${mixColor(isOvertime ? 'oklch(0.85 0.22 25)' : accentColor, 0.24)} 0%, transparent 72%)`,
                    }}
                  />
                  <div className="relative">
                    <CircularProgress
                      percentage={percentage}
                      color={accentColor}
                      size={timerSize}
                      strokeWidth={18}
                      isOvertime={isOvertime}
                      overtimePercentage={overtimePercentage}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="text-center"
                        animate={isOvertime ? { scale: [1, 1.04, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="font-mono font-bold tabular-nums tracking-[-0.05em]"
                          style={{
                            fontSize: timeForDisplay.hours === '00' ? '5rem' : '3.6rem',
                            color: isOvertime ? 'oklch(0.85 0.22 25)' : currentTheme.timerColor,
                          }}
                        >
                          {timeForDisplay.hours !== '00' && (
                            <>
                              {timeForDisplay.hours}
                              <span className="opacity-55">:</span>
                            </>
                          )}
                          {timeForDisplay.minutes}
                          <span className="opacity-55">:</span>
                          {timeForDisplay.seconds}
                        </div>
                        <p
                          className="mt-3 text-xs uppercase tracking-[0.32em]"
                          style={{ color: mixColor(currentTheme.cardForeground, 0.55) }}
                        >
                          {isOvertime ? 'Past zero' : isActive ? 'Time remaining' : 'Paused'}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="space-y-4 sm:space-y-5">
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    { label: 'Theme', value: currentTheme.name, icon: Palette },
                    {
                      label: 'Base duration',
                      value: `${String(Math.floor(previewSeconds / 60)).padStart(2, '0')} min`,
                      icon: Clock,
                    },
                    {
                      label: 'Control',
                      value: isActive ? 'Tap space to pause' : 'Tap space to resume',
                      icon: Keyboard,
                    },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-[24px] border p-4"
                      style={panelStyle}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-10 items-center justify-center rounded-2xl border"
                          style={{
                            borderColor: mixColor(accentColor, 0.24),
                            backgroundColor: mixColor(accentColor, 0.14),
                            color: currentTheme.timerColor,
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em]" style={{ color: mixColor(currentTheme.cardForeground, 0.48) }}>
                            {label}
                          </p>
                          <p className="mt-1 text-sm font-medium" style={{ color: currentTheme.cardForeground }}>
                            {value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[28px] border p-5 sm:p-6" style={panelStyle}>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.28em]"
                    style={{ color: mixColor(currentTheme.cardForeground, 0.54) }}
                  >
                    Controls
                  </p>
                  <div className="mt-5 grid gap-3">
                    <Button
                      onClick={isActive ? pauseTimer : resumeTimer}
                      size="lg"
                      className={`${actionButtonClass} border-0 text-white`}
                      style={primaryButtonStyle}
                    >
                      {isActive ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
                      {isActive ? 'Pause' : 'Resume'}
                    </Button>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button
                        onClick={restartTimer}
                        size="lg"
                        variant="outline"
                        className={`${actionButtonClass} backdrop-blur-xl`}
                        style={{
                          backgroundColor: mixColor(currentTheme.background, 0.44),
                          borderColor: mixColor(currentTheme.cardForeground, 0.1),
                          color: currentTheme.cardForeground,
                        }}
                      >
                        <ArrowClockwise size={18} />
                        Restart
                      </Button>
                      <Button
                        onClick={resetTimer}
                        size="lg"
                        variant="outline"
                        className={`${actionButtonClass} backdrop-blur-xl`}
                        style={{
                          backgroundColor: mixColor(currentTheme.background, 0.44),
                          borderColor: mixColor(currentTheme.cardForeground, 0.1),
                          color: currentTheme.cardForeground,
                        }}
                      >
                        <ArrowCounterClockwise size={18} />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border p-5 sm:p-6" style={panelStyle}>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-11 items-center justify-center rounded-2xl border"
                      style={{
                        borderColor: mixColor(currentTheme.cardForeground, 0.1),
                        backgroundColor: mixColor(currentTheme.background, 0.34),
                        color: currentTheme.cardForeground,
                      }}
                    >
                      <Keyboard size={18} />
                    </div>
                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-[0.28em]"
                        style={{ color: mixColor(currentTheme.cardForeground, 0.54) }}
                      >
                        Keyboard commands
                      </p>
                      <p className="mt-2 text-sm" style={{ color: mixColor(currentTheme.cardForeground, 0.72) }}>
                        Studio-safe controls without clicking away from your workflow.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm" style={{ color: mixColor(currentTheme.cardForeground, 0.72) }}>
                    {[
                      ['SPACE', isActive ? 'Pause' : 'Resume'],
                      ['R', 'Restart'],
                      ['ESC', 'Reset'],
                    ].map(([key, description]) => (
                      <div key={key} className="inline-flex items-center gap-2 rounded-full border px-3 py-2" style={{ borderColor: mixColor(currentTheme.cardForeground, 0.1), backgroundColor: mixColor(currentTheme.background, 0.32) }}>
                        <span
                          className={shortcutClass}
                          style={{
                            backgroundColor: mixColor(currentTheme.card, 0.84),
                            borderColor: mixColor(currentTheme.cardForeground, 0.12),
                            color: currentTheme.cardForeground,
                          }}
                        >
                          {key}
                        </span>
                        <span>{description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default App
