# OBS Integration Guide

This countdown timer can be integrated into OBS Studio as a browser source overlay for streaming and recording.

## Quick Setup

### 1. Add Browser Source in OBS

1. In OBS, click the **+** button in the Sources panel
2. Select **Browser**
3. Name it "Countdown Timer" (or whatever you prefer)
4. Click **OK**

### 2. Configure the Browser Source

In the Browser Source properties:

**URL:** Enter your timer URL with OBS mode enabled:
```text
https://stasfeelin.github.io/visual-countdown/?obs=true
```

**Width:** `1920` (or your canvas width)

**Height:** `1080` (or your canvas height)

**Custom CSS:** (optional, add this to remove scrollbars)
```css
body { margin: 0px auto; overflow: hidden; }
```

✅ Check these boxes:
- ☑ **Shutdown source when not visible** (saves resources)
- ☑ **Refresh browser when scene becomes active** (optional)

## URL Parameters

Customize the timer behavior using URL parameters:

### Required for OBS Mode
- `?obs=true` - Enables transparent overlay mode

### Optional Parameters
- `&minutes=X` - Set initial minutes (e.g., `minutes=25`)
- `&hours=X` - Set initial hours (e.g., `hours=1`)
- `&seconds=X` - Set initial seconds (e.g., `seconds=30`)
- `&autostart=true` - Automatically starts the timer on load

### Example URLs

**Basic OBS mode (5 minutes default):**
```text
https://stasfeelin.github.io/visual-countdown/?obs=true
```

**25-minute Pomodoro timer that auto-starts:**
```text
https://stasfeelin.github.io/visual-countdown/?obs=true&minutes=25&autostart=true
```

**90-second quick timer:**
```text
https://stasfeelin.github.io/visual-countdown/?obs=true&minutes=1&seconds=30&autostart=true
```

**1 hour presentation timer:**
```text
https://stasfeelin.github.io/visual-countdown/?obs=true&hours=1&autostart=true
```

## Keyboard Controls

Control the timer from anywhere (even when OBS is in the background):

| Key | Action |
|-----|--------|
| **SPACE** | Start timer / Pause / Resume |
| **R** | Restart current timer |
| **ESC** | Reset to setup screen |

💡 **Tip:** You can use OBS hotkeys or Stream Deck buttons to trigger these keyboard shortcuts.

## OBS Mode Features

When `?obs=true` is enabled:

✨ **Transparent Background** - Only the timer circle and numbers are visible
✨ **No UI Controls** - Clean overlay without buttons (use keyboard shortcuts)
✨ **High Contrast** - White text with drop shadows for visibility on any background
✨ **Thicker Progress Ring** - More visible on stream (14px vs 12px)
✨ **Setup Indicator** - Shows keyboard shortcuts when in setup mode

## Positioning & Styling

### Position the Timer
- Drag the browser source in the OBS preview to position it
- Use the transform controls (right-click → Transform) for precise placement
- Scale it up or down as needed

### Common Placements
- **Top Right Corner** - Classic timer placement
- **Bottom Center** - Less intrusive for viewers
- **Top Left** - Near your webcam
- **Full Screen** - For countdown intros

### Scene Transitions
Create multiple browser sources with different timer durations for different segments:
- Break Timer (5 minutes)
- Q&A Timer (15 minutes)
- Pomodoro Timer (25 minutes)
- Stream Ending Timer (1 minute)

## Advanced: Multiple Timers

Create separate browser sources for different purposes:

1. **Starting Soon Timer**
   - URL: `?obs=true&minutes=5&autostart=true`
   - Use in your "Starting Soon" scene

2. **Break Timer**
   - URL: `?obs=true&minutes=10&autostart=true`
   - Use in your "BRB" scene

3. **Game Round Timer**
   - URL: `?obs=true&minutes=15`
   - Manually start with SPACE when round begins

## Troubleshooting

### Timer is visible but not transparent
- Make sure `?obs=true` is in the URL
- Check that "Shutdown source when not visible" is enabled
- Try refreshing the browser source (right-click → Refresh)

### Timer doesn't respond to keyboard shortcuts
- Click on the OBS preview to give it focus
- Or use OBS hotkeys instead of direct keyboard input

### Timer resets when switching scenes
- Uncheck "Refresh browser when scene becomes active"
- Or use the same browser source across multiple scenes

### Performance issues
- Enable "Shutdown source when not visible"
- Reduce the browser source resolution if needed
- Make sure hardware acceleration is enabled in OBS settings

## Tips for Streamers

🎯 **Use autostart for automated timers** - Perfect for break screens and scheduled segments

⌨️ **Set up OBS hotkeys** - Map timer controls to Stream Deck or keyboard shortcuts

🎨 **Match your brand** - Configure the timer color in regular mode, it persists in OBS mode

⏱️ **Overtime tracking** - Timer automatically goes red and counts up when time expires - great for debates, Q&A sessions, or speed challenges

📺 **Test before going live** - Always test your timer setup in a private stream or recording first
