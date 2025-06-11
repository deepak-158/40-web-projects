# Digital Clock & Alarm ⏰

Project #5! I built a digital clock with alarm features. This one was fun because I finally got to work with time and audio APIs.

## What it does

**Clock stuff:**
- Shows the current time (obviously)
- You can switch between 12-hour and 24-hour format
- Displays the date too
- Has this cool green glow effect (I was going for that retro digital clock vibe)

**Alarm stuff:**
- Set multiple alarms
- Easy dropdowns to pick the time
- Turn alarms on/off without deleting them
- Snooze for 5 more minutes when you're not ready to wake up
- Makes noise when it goes off (obviously)
- Automatically stops after a minute if you ignore it

## How to use it

Just open `index.html` and:
- The clock starts automatically
- Use the dropdowns to set an alarm time
- Click "Set Alarm" to add it
- When it goes off, you can snooze or dismiss it

## Built with

- **HTML** - The structure
- **CSS** - Lots of styling, gradients, and that glowing effect
- **JavaScript** - Time handling, alarm logic, sound
- **Web Audio API** - For the alarm sound (this was new to me!)

## Cool things I learned

- How `setInterval` works for updating the clock every second
- Working with Date objects in JavaScript is surprisingly complex
- The Web Audio API for playing sounds
- How to create those glass-effect designs with CSS
- Time zones are way more complicated than I thought

## Features I'm proud of

- **Multiple alarms** - You can have several set at once
- **Snooze function** - Adds 5 minutes and creates a new alarm automatically
- **12/24 hour toggle** - Because people prefer different formats
- **Glassmorphism design** - This trendy design style with blurred backgrounds
- **Responsive layout** - Works on phones and desktops

## Issues I ran into

- Getting the time to update smoothly without flickering
- Making the alarm sound work (browsers don't like auto-playing audio)
- Figuring out how to handle multiple alarms efficiently
- Making the modal popup look good and work properly
- CSS animations were harder than expected

## Things I want to add later

- Custom alarm sounds (right now it's just a beep)
- Recurring alarms for daily wake-ups
- Maybe a world clock with different time zones
- Dark theme option

This project taught me a lot about working with time in JavaScript and creating better user interfaces. The audio part was especially tricky but really satisfying when it finally worked!
