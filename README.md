# Countdown Timer

A visual countdown timer with circular progress indicator, perfect for streaming, presentations, and time management.

## ✨ Features

- **Visual Circular Progress** - Animated progress ring that depletes as time runs out
- **Customizable Colors** - Choose from 12 preset colors to match your style
- **Quick Presets** - 5, 15, and 25-minute quick-start buttons
- **Overtime Tracking** - Automatically switches to red and counts up when time expires
- **Keyboard Shortcuts** - Control without clicking (perfect for OBS)
- **OBS Integration** - Transparent overlay mode for streaming
- **URL Configuration** - Set timer parameters via URL for automated setups

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `SPACE` | Start / Pause / Resume timer |
| `R` | Restart current timer |
| `ESC` | Reset to setup screen |

## 🎥 OBS Integration

This timer is designed to work seamlessly with OBS Studio as a browser source overlay.

### Quick Setup

1. **Add Browser Source** in OBS
2. **Set the URL** to: `your-timer-url?obs=true`
3. **Set dimensions** to match your canvas (e.g., 1920x1080)
4. **Enable** "Shutdown source when not visible" (optional)

### URL Parameters

- `?obs=true` - Enables transparent overlay mode **(required for OBS)**
- `&minutes=X` - Set initial minutes (e.g., `minutes=25`)
- `&hours=X` - Set initial hours
- `&seconds=X` - Set initial seconds
- `&autostart=true` - Auto-start timer on load

### Example URLs

**25-minute Pomodoro timer (auto-start):**
```
your-timer-url?obs=true&minutes=25&autostart=true
```

**5-minute break timer:**
```
your-timer-url?obs=true&minutes=5&autostart=true
```

**90-second countdown:**
```
your-timer-url?obs=true&minutes=1&seconds=30&autostart=true
```

📚 **[View Full OBS Integration Guide](./OBS_GUIDE.md)** for detailed setup instructions, tips, and troubleshooting.

## 🎨 Features Detail

### Normal Mode
- Full UI with setup controls
- Color picker for customization
- Preset quick timers
- Manual time input (hours, minutes, seconds)
- Keyboard shortcuts hint

### OBS Overlay Mode (`?obs=true`)
- Transparent background
- No UI controls (keyboard only)
- High contrast with drop shadows
- Thicker progress ring for visibility
- Setup indicator with keyboard shortcuts

### Timer States
1. **Setup** - Configure time and color
2. **Running** - Active countdown with depleting circle
3. **Paused** - Frozen time, can be resumed
4. **Overtime** - Red theme, counting upward from zero

## 💡 Use Cases

- **Streaming** - Show viewers how much time is left in a segment
- **Presentations** - Keep your talks on schedule
- **Pomodoro Technique** - 25-minute focus sessions with visible progress
- **Game Shows** - Timed challenges and rounds
- **Workouts** - Interval training and rest periods
- **Breaks** - "Be Right Back" countdown on stream
- **Debates** - Speaker time limits with overtime tracking

## 🎯 Tips for Streamers

- Create multiple browser sources with different durations for different segments
- Use `autostart=true` for automated break timers
- Map keyboard shortcuts to your Stream Deck
- The overtime feature is great for Q&A sessions or speed challenges
- Configure your brand color in regular mode - it persists across sessions

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
