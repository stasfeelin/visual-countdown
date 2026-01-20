# Planning Guide

A visual countdown timer with a circular progress indicator that transforms into an overtime tracker when time expires.

**Experience Qualities**:
1. **Focused** - The circular design centers attention on the remaining time, minimizing distractions
2. **Intuitive** - Visual progress through the circle makes time perception immediate and effortless
3. **Urgent** - The red overtime state creates clear visual feedback when deadlines are exceeded

**Complexity Level**: Light Application (multiple features with basic state)
This is a single-purpose timer with multiple states (setup, countdown, overtime) and visual feedback mechanisms that require coordinated state management.

## Essential Features

**Time Input**
- Functionality: User sets countdown duration in hours, minutes, and seconds
- Purpose: Allows flexible timer configuration for various use cases
- Trigger: Initial app load or reset button
- Progression: Input fields visible → User enters time values → Start button becomes enabled → Click start to begin countdown
- Success criteria: Timer accepts valid time input and prevents invalid values (negative numbers, non-numeric input)

**Countdown Visualization**
- Functionality: Circular progress bar depletes clockwise as time decreases, with digital time display in center
- Purpose: Provides both precise (digital) and intuitive (circular) feedback on remaining time
- Trigger: User clicks start button with valid time input
- Progression: Full circle in user-selected color → Circle depletes clockwise → Digital time counts down → Both reach zero simultaneously
- Success criteria: Circle and digital time remain synchronized throughout countdown

**Color Selection**
- Functionality: User chooses the color for the countdown circle before starting
- Purpose: Personalization and visual distinction for different timer types
- Trigger: Before starting countdown, user selects from color palette
- Progression: Color picker visible → User selects color → Circle preview updates → Selection persists during countdown
- Success criteria: Selected color applies to circle and persists throughout countdown phase

**Overtime Tracking**
- Functionality: When countdown reaches zero, automatically switches to counting up with red visual theme
- Purpose: Shows how much time has exceeded the original deadline
- Trigger: Countdown reaches 00:00:00
- Progression: Timer hits zero → Numbers turn red → Circle begins filling from opposite direction in red → Counts upward indefinitely
- Success criteria: Seamless transition with no manual intervention, clear visual distinction from countdown phase

**Pause/Resume Control**
- Functionality: Ability to pause and resume the timer at any point
- Purpose: Accommodates interruptions without losing progress
- Trigger: User clicks pause/play button during active timer
- Progression: Active timer → Click pause → Time freezes, circle stops → Click resume → Timer continues from paused point
- Success criteria: Time and circle position resume exactly where they stopped

**Reset Control**
- Functionality: Returns to initial time input state
- Purpose: Allows starting fresh without page reload
- Trigger: User clicks reset button at any time
- Progression: Any timer state → Click reset → Returns to time input view → Previous settings cleared
- Success criteria: Complete state reset with smooth transition

**OBS Integration Mode**
- Functionality: Transparent overlay mode optimized for OBS Studio browser sources with URL parameter configuration
- Purpose: Enables seamless integration into streaming and recording software without visible UI controls
- Trigger: URL parameter `?obs=true` activates overlay mode
- Progression: OBS mode enabled → Timer displays with transparent background → Controls hidden → Keyboard shortcuts active → Timer operates as clean overlay
- Success criteria: Transparent background, no UI chrome, keyboard control works, configurable via URL parameters (autostart, minutes, hours, seconds)

**Keyboard Controls**
- Functionality: Global keyboard shortcuts for timer control without clicking UI
- Purpose: Allows streamers and presenters to control timer without showing cursor or UI interaction
- Trigger: User presses designated keyboard shortcuts
- Progression: SPACE (start/pause/resume) → R (restart) → ESC (reset) → Immediate timer response
- Success criteria: Shortcuts work in all timer states, no conflicts with browser defaults, visual feedback for actions

## Edge Case Handling

- **Zero Input**: If user attempts to start with all zeros, disable start button or show validation message
- **Very Long Durations**: Support timers up to 99 hours, 59 minutes, 59 seconds with proper formatting
- **Browser Tab Inactive**: Timer continues running in background, displays accurate time when tab regains focus
- **Rapid Button Clicks**: Debounce start/pause/reset to prevent multiple triggers
- **Mid-Countdown Reset**: Confirm reset action if timer is running to prevent accidental loss
- **OBS Scene Transitions**: Timer state persists when browser source is hidden/shown in different scenes
- **Multiple Timer Instances**: Each browser source in OBS operates independently with separate state
- **URL Parameter Conflicts**: Invalid URL parameters gracefully fall back to stored defaults

## Design Direction

The design should evoke precision, clarity, and calm focus with a moment of urgency when time expires. The interface should feel like a professional tool—clean, uncluttered, and purpose-built. The circular visualization should dominate the screen as the hero element, with controls feeling secondary and non-intrusive.

## Color Selection

A professional palette with vibrant customizable countdown colors and a bold red for overtime urgency.

- **Primary Color**: Deep Indigo (oklch(0.35 0.15 265)) - Communicates reliability and focus for primary UI elements and default timer state
- **Secondary Colors**: Soft Gray (oklch(0.92 0.01 265)) for backgrounds and Light Slate (oklch(0.55 0.02 265)) for secondary controls
- **Accent Color**: Electric Cyan (oklch(0.75 0.15 195)) - For active interactions and the currently selected color indicator
- **Foreground/Background Pairings**: 
  - Background (Pale Gray #F8F9FB / oklch(0.98 0.005 265)): Dark text (oklch(0.25 0.02 265)) - Ratio 13.2:1 ✓
  - Primary (Deep Indigo): White text (oklch(0.99 0 0)) - Ratio 7.8:1 ✓
  - Accent (Electric Cyan): Dark text (oklch(0.25 0.02 265)) - Ratio 5.1:1 ✓
  - Overtime Red (oklch(0.55 0.22 25)): White text (oklch(0.99 0 0)) - Ratio 5.2:1 ✓

## Font Selection

Typography should be technical and precise, with monospaced numerals for the countdown readability.

- **Typographic Hierarchy**:
  - Timer Display: JetBrains Mono Bold / 72px (mobile: 48px) / Tabular numerals for stable width
  - Input Labels: Space Grotesk Medium / 14px / Tracking 0.02em
  - Button Text: Space Grotesk Semibold / 16px / Uppercase tracking 0.05em
  - Helper Text: Space Grotesk Regular / 12px / Muted color

## Animations

Animations should enhance perception of time passing while maintaining calm focus, with a distinct transition at zero.

- **Circle Depletion**: Smooth linear animation synchronized with countdown, updating every 100ms for fluid motion
- **Zero Transition**: Brief 300ms pulse animation on both circle and numbers when switching to overtime
- **Button States**: Subtle 150ms ease transitions for hover/active states
- **Input Focus**: Gentle 200ms border color shift with subtle scale (1.01) on number inputs
- **Color Selection**: Soft 250ms color transitions when user previews different colors

## Component Selection

- **Components**: 
  - Card (shadcn) for main timer container with custom rounded styling
  - Button (shadcn) for start/pause/reset controls with icon integration
  - Input (shadcn) for time value entry with numeric validation
  - Popover (shadcn) for color picker with custom color swatches
  - Badge (shadcn) for labeling time input fields (HH/MM/SS)
- **Customizations**: 
  - Custom circular progress SVG component with dynamic stroke-dashoffset based on time remaining
  - Color palette component with grid of circular swatches
  - Timer controls floating below circle with glass morphism effect
- **States**: 
  - Inputs: Clear focus states with accent color border and subtle shadow
  - Buttons: Primary (solid with hover lift), Secondary (outline with hover fill), Icon-only (hover background)
  - Color swatches: Selected state with accent ring and checkmark icon
  - Timer states: Setup (inputs visible), Running (controls visible), Paused (play icon shown), Overtime (red theme applied)
- **Icon Selection**: 
  - Play (phosphor-icons) for start/resume
  - Pause for pause action
  - ArrowCounterClockwise for reset
  - Check for selected color swatch
- **Spacing**: 
  - Main container: p-8 on desktop, p-6 on mobile
  - Component gaps: gap-6 for vertical stacking, gap-4 for horizontal button groups
  - Input field spacing: gap-3 between hour/minute/second inputs
  - Color swatches: gap-2 in grid layout
- **Mobile**: 
  - Circle scales down from 400px to 280px diameter
  - Timer font reduces from 72px to 48px
  - Buttons stack vertically instead of horizontally
  - Input fields remain horizontal but with reduced padding
  - Color picker grid adjusts from 6 columns to 4 columns
