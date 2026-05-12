import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TimeInputProps {
  hours: number
  minutes: number
  seconds: number
  onHoursChange: (value: number) => void
  onMinutesChange: (value: number) => void
  onSecondsChange: (value: number) => void
}

export function TimeInput({
  hours,
  minutes,
  seconds,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
}: TimeInputProps) {
  const handleChange = (
    value: string,
    max: number,
    onChange: (value: number) => void
  ) => {
    const num = parseInt(value) || 0
    onChange(Math.min(Math.max(0, num), max))
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-end">
      <div className="flex flex-col gap-2">
        <Label htmlFor="hours" className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Hours
        </Label>
        <Input
          id="hours"
          type="number"
          min="0"
          max="99"
          value={hours}
          onChange={(e) => handleChange(e.target.value, 99, onHoursChange)}
          className="h-16 rounded-[22px] border-white/10 bg-white/6 px-4 text-center text-3xl font-mono font-semibold tabular-nums shadow-[0_20px_40px_-30px_rgba(15,23,42,0.8)] backdrop-blur-xl"
        />
      </div>

      <span className="hidden pb-4 text-center text-3xl font-bold text-muted-foreground sm:block">:</span>

      <div className="flex flex-col gap-2">
        <Label htmlFor="minutes" className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Minutes
        </Label>
        <Input
          id="minutes"
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => handleChange(e.target.value, 59, onMinutesChange)}
          className="h-16 rounded-[22px] border-white/10 bg-white/6 px-4 text-center text-3xl font-mono font-semibold tabular-nums shadow-[0_20px_40px_-30px_rgba(15,23,42,0.8)] backdrop-blur-xl"
        />
      </div>

      <span className="hidden pb-4 text-center text-3xl font-bold text-muted-foreground sm:block">:</span>

      <div className="flex flex-col gap-2">
        <Label htmlFor="seconds" className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Seconds
        </Label>
        <Input
          id="seconds"
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={(e) => handleChange(e.target.value, 59, onSecondsChange)}
          className="h-16 rounded-[22px] border-white/10 bg-white/6 px-4 text-center text-3xl font-mono font-semibold tabular-nums shadow-[0_20px_40px_-30px_rgba(15,23,42,0.8)] backdrop-blur-xl"
        />
      </div>
    </div>
  )
}
