# Typing Speed Tester ⌨️

Project #9! This one was super challenging but really fun to build. I wanted to create something that actually measures typing speed accurately.

## What it does

- **Test your typing speed** in Words Per Minute (WPM)
- **Measure accuracy** and track errors in real-time
- **Multiple difficulty levels** (Easy, Medium, Hard)
- **Customizable test duration** (30s, 1m, 2m, 5m)
- **Real-time highlighting** shows correct/incorrect characters
- **Detailed results** with performance feedback
- **Share your results** with friends

## How to use it

1. Choose your test duration and difficulty level
2. Click "Start Test" to begin
3. Type the displayed text as accurately as possible
4. Green = correct, Red = incorrect, Blue = current character
5. Get detailed results when time runs out

## Built with

- **HTML** - The structure
- **CSS** - Lots of animations and real-time highlighting
- **JavaScript** - Complex timing logic and character comparison

## What I learned

This was probably my most technically challenging project so far:
- Real-time character comparison and highlighting
- Precise timing calculations for WPM/CPM
- Preventing cheating (no copy/paste allowed!)
- Managing multiple states (settings, test, results)
- Creating smooth animations for better UX

## Cool features I added

- **Real-time stats** - Watch your WPM and accuracy update as you type
- **Character highlighting** - See exactly where you make mistakes
- **Multiple difficulties** - From simple sentences to complex technical text
- **Performance messages** - Get personalized feedback based on your results
- **Anti-cheat** - Prevents copy/paste and other shortcuts
- **Responsive design** - Works great on all devices
- **Share results** - Copy results to clipboard or use native sharing

## Technical challenges I solved

- **Accurate WPM calculation** - Had to research the standard formula (characters ÷ 5 ÷ minutes)
- **Real-time text comparison** - Compare user input with target text character by character
- **Timer management** - Precise countdown with proper cleanup
- **State management** - Handle settings, active test, and results screens
- **Accessibility** - High contrast mode and keyboard navigation
- **Performance** - Efficient DOM updates for smooth real-time highlighting

## Different difficulty levels

- **Easy**: Simple sentences with common words
- **Medium**: Technical topics with moderate vocabulary
- **Hard**: Complex topics with advanced terminology and punctuation

## Performance benchmarks

- **25+ WPM**: Beginner level
- **40+ WPM**: Average typing speed
- **60+ WPM**: Above average
- **80+ WPM**: Expert level

This project taught me a lot about precision timing, real-time data processing, and creating engaging user interactions. The hardest part was getting the character-by-character comparison to work smoothly without performance issues!
