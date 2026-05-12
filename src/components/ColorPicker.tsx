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
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full gap-3">
          <div
            className="h-5 w-5 rounded-full border-2 border-border"
            style={{ backgroundColor: selectedColor }}
          />
          <span>Choose Color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid grid-cols-4 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(color.value)}
              className="group relative h-12 w-full rounded-lg border-2 transition-all hover:scale-105"
              style={{
                backgroundColor: color.value,
                borderColor: selectedColor === color.value ? 'oklch(0.7 0.18 195)' : 'oklch(0.35 0.03 265)',
              }}
              aria-label={`Select ${color.name}`}
            >
              {selectedColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
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
