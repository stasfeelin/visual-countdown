import { Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type Theme = {
  name: string
  id: string
  background: string
  foreground: string
  card: string
  cardForeground: string
  timerColor: string
}

export const THEMES: Theme[] = [
  {
    name: 'Dark Purple',
    id: 'dark-purple',
    background: 'oklch(0.15 0.02 265)',
    foreground: 'oklch(0.97 0.01 265)',
    card: 'oklch(0.22 0.025 265)',
    cardForeground: 'oklch(0.97 0.01 265)',
    timerColor: 'oklch(0.97 0.01 265)',
  },
  {
    name: 'Light',
    id: 'light',
    background: 'oklch(0.98 0.005 265)',
    foreground: 'oklch(0.2 0.015 265)',
    card: 'oklch(1 0 0)',
    cardForeground: 'oklch(0.2 0.015 265)',
    timerColor: 'oklch(0.2 0.015 265)',
  },
  {
    name: 'Dark',
    id: 'dark',
    background: 'oklch(0.12 0.01 265)',
    foreground: 'oklch(0.95 0.005 265)',
    card: 'oklch(0.18 0.015 265)',
    cardForeground: 'oklch(0.95 0.005 265)',
    timerColor: 'oklch(0.95 0.005 265)',
  },
  {
    name: 'Ocean Blue',
    id: 'ocean',
    background: 'oklch(0.16 0.04 240)',
    foreground: 'oklch(0.96 0.01 240)',
    card: 'oklch(0.23 0.045 240)',
    cardForeground: 'oklch(0.96 0.01 240)',
    timerColor: 'oklch(0.96 0.01 240)',
  },
  {
    name: 'Forest Green',
    id: 'forest',
    background: 'oklch(0.14 0.035 155)',
    foreground: 'oklch(0.96 0.01 155)',
    card: 'oklch(0.21 0.04 155)',
    cardForeground: 'oklch(0.96 0.01 155)',
    timerColor: 'oklch(0.96 0.01 155)',
  },
  {
    name: 'Midnight',
    id: 'midnight',
    background: 'oklch(0.1 0.02 265)',
    foreground: 'oklch(0.92 0.01 200)',
    card: 'oklch(0.15 0.025 265)',
    cardForeground: 'oklch(0.92 0.01 200)',
    timerColor: 'oklch(0.92 0.01 200)',
  },
  {
    name: 'Sunset',
    id: 'sunset',
    background: 'oklch(0.17 0.04 35)',
    foreground: 'oklch(0.97 0.01 35)',
    card: 'oklch(0.24 0.045 35)',
    cardForeground: 'oklch(0.97 0.01 35)',
    timerColor: 'oklch(0.97 0.01 35)',
  },
  {
    name: 'Warm Light',
    id: 'warm-light',
    background: 'oklch(0.96 0.02 75)',
    foreground: 'oklch(0.22 0.02 75)',
    card: 'oklch(0.99 0.01 75)',
    cardForeground: 'oklch(0.22 0.02 75)',
    timerColor: 'oklch(0.22 0.02 75)',
  },
]

interface ThemePickerProps {
  selectedThemeId: string
  onThemeChange: (theme: Theme) => void
}

export function ThemePicker({ selectedThemeId, onThemeChange }: ThemePickerProps) {
  const selectedTheme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full gap-3">
          <div
            className="h-5 w-5 rounded-full border-2 border-border"
            style={{ backgroundColor: selectedTheme.background }}
          />
          <span>Theme: {selectedTheme.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground mb-3">Choose Theme</p>
          <div className="grid gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme)}
                className="group relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: theme.card,
                  borderColor: selectedThemeId === theme.id ? 'oklch(0.7 0.18 195)' : 'oklch(0.35 0.03 265)',
                }}
                aria-label={`Select ${theme.name} theme`}
              >
                <div
                  className="h-8 w-8 rounded-md border-2"
                  style={{
                    backgroundColor: theme.background,
                    borderColor: theme.foreground,
                  }}
                />
                <span className="flex-1 text-left font-medium" style={{ color: theme.cardForeground }}>
                  {theme.name}
                </span>
                {selectedThemeId === theme.id && (
                  <Check size={20} weight="bold" style={{ color: theme.cardForeground }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
