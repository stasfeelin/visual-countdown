import { Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const PRESET_COLORS = [
  { name: 'Purple', value: 'oklch(0.65 0.2 265)' },
  { name: 'Blue', value: 'oklch(0.65 0.18 250)' },
  { name: 'Cyan', value: 'oklch(0.7 0.18 195)' },
  { name: 'Teal', value: 'oklch(0.68 0.16 180)' },
  { name: 'Green', value: 'oklch(0.68 0.18 145)' },
  { name: 'Lime', value: 'oklch(0.75 0.18 125)' },
  { name: 'Yellow', value: 'oklch(0.8 0.16 95)' },
  { name: 'Orange', value: 'oklch(0.7 0.18 55)' },
  { name: 'Pink', value: 'oklch(0.7 0.2 350)' },
  { name: 'Rose', value: 'oklch(0.68 0.2 15)' },
  { name: 'Indigo', value: 'oklch(0.6 0.18 275)' },
  { name: 'Violet', value: 'oklch(0.62 0.2 300)' },
]

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  const selectedPreset = PRESET_COLORS.find((color) => color.value === selectedColor)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-14 w-full justify-start rounded-[22px] border-white/10 bg-white/6 px-4 text-left shadow-[0_20px_40px_-30px_rgba(15,23,42,0.8)] backdrop-blur-xl">
          <div
            className="h-5 w-5 rounded-full border-2 border-border"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="flex flex-col items-start">
            <span>Accent Color</span>
            <span className="text-xs font-normal text-muted-foreground">
              {selectedPreset?.name ?? 'Custom glow'}
            </span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 rounded-[24px] border-white/10 bg-black/30 p-4 backdrop-blur-2xl">
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Accent glow</p>
          <p className="mt-2 text-sm text-foreground/80">Pick the signature highlight that powers the ring, buttons, and overlays.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(color.value)}
              className="group relative overflow-hidden rounded-[20px] border p-2 text-left transition duration-200 hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(180deg, ${color.value} 0%, color-mix(in oklab, ${color.value} 36%, #050816) 100%)`,
                borderColor: selectedColor === color.value ? 'oklch(0.7 0.18 195)' : 'color-mix(in oklab, white 10%, transparent)',
              }}
              aria-label={`Select ${color.name}`}
            >
              <span className="block h-14 rounded-[14px] border border-white/12" style={{ backgroundColor: color.value }} />
              <span className="mt-2 block px-1 text-xs font-medium text-white/88">{color.name}</span>
              {selectedColor === color.value && (
                <div className="absolute inset-x-0 top-5 flex items-center justify-center">
                  <Check size={20} weight="bold" className="text-white drop-shadow-lg" />
                </div>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
