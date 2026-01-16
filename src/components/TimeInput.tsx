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
    <div className="flex items-end gap-3 justify-center">
      <div className="flex flex-col gap-2">
        <Label htmlFor="hours" className="text-xs uppercase tracking-wider text-muted-foreground">
          Hours
        </Label>
        <Input
          id="hours"
          type="number"
          min="0"
          max="99"
          value={hours}
          onChange={(e) => handleChange(e.target.value, 99, onHoursChange)}
          className="w-20 text-center text-lg font-mono font-semibold tabular-nums"
        />
      </div>
      <span className="text-2xl font-bold text-muted-foreground pb-2">:</span>
      <div className="flex flex-col gap-2">
        <Label htmlFor="minutes" className="text-xs uppercase tracking-wider text-muted-foreground">
          Minutes
        </Label>
        <Input
          id="minutes"
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => handleChange(e.target.value, 59, onMinutesChange)}
          className="w-20 text-center text-lg font-mono font-semibold tabular-nums"
        />
      </div>
      <span className="text-2xl font-bold text-muted-foreground pb-2">:</span>
      <div className="flex flex-col gap-2">
        <Label htmlFor="seconds" className="text-xs uppercase tracking-wider text-muted-foreground">
          Seconds
        </Label>
        <Input
          id="seconds"
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={(e) => handleChange(e.target.value, 59, onSecondsChange)}
          className="w-20 text-center text-lg font-mono font-semibold tabular-nums"
        />
      </div>
    </div>
  )
}
