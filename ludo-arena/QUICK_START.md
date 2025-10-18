# 🚀 Quick Start Guide - Ludo Arena

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation & Setup

### 1. Navigate to Project
```bash
cd ludo-arena
```

### 2. Install Dependencies (if not already done)
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

## 🎮 What You'll See

### Homepage Features
1. **Beautiful Animated Background**
   - Multi-color gradients flowing smoothly
   - Floating particle effects
   
2. **Game Mode Selection**
   - 🧠 Play vs Computer button
   - 🧍 Play with Friends button
   
3. **Music Control**
   - Toggle button in top-right corner
   - Click to enable/disable background music
   - State persists across page refreshes

### How to Test

#### Test Game Mode Selection
1. Click "Play vs Computer"
   - You'll be redirected to `/select?mode=computer`
   - Your selection is saved to localStorage
   
2. Click "Play with Friends"
   - You'll be redirected to `/select?mode=local`
   - Your selection is saved to localStorage

#### Test Music System
1. Click the music toggle button (top-right)
2. Music should start playing (if browser allows)
3. Refresh the page - music state should persist
4. Click again to mute

#### Test Responsive Design
1. Resize your browser window
2. Try on mobile device
3. All elements should adapt smoothly

## 📁 Adding Real Audio Files

Replace placeholder files in `/public/sounds/`:

```bash
# Add your audio files (MP3 format recommended)
cp your-background-music.mp3 public/sounds/bg-music.mp3
cp your-dice-sound.mp3 public/sounds/dice.mp3
cp your-move-sound.mp3 public/sounds/move.mp3
cp your-win-sound.mp3 public/sounds/win.mp3
```

**Audio Recommendations:**
- **bg-music.mp3**: Loopable, 2-4 minutes, upbeat game music
- **dice.mp3**: Short (0.5-1s), dice rolling sound
- **move.mp3**: Short (0.3-0.5s), token movement
- **win.mp3**: 2-3s celebration sound

## 🔨 Development Commands

### Start Dev Server (with Turbopack)
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Run Linter
```bash
npm run lint
```

## 🌐 PWA Testing

### Test Offline Functionality
1. Build the project: `npm run build && npm start`
2. Open Chrome DevTools
3. Go to Application → Service Workers
4. Check "Offline" mode
5. Reload the page - it should still work!

### Install as PWA
1. In Chrome, click the install icon in the address bar
2. The app will be installed as a standalone app
3. Access from your apps menu

## 🎨 Customization

### Change Colors
Edit `/app/globals.css`:
```css
:root {
  --primary: #8b5cf6;  /* Purple */
  --secondary: #06b6d4; /* Cyan */
}
```

### Adjust Animations
Edit `/app/page.tsx` - look for Framer Motion `animate` and `transition` props.

### Modify Particle Count
In `/app/page.tsx`, line with particles:
```tsx
{[...Array(20)].map((_, i) => ( // Change 20 to desired count
```

## 🐛 Troubleshooting

### Music Doesn't Play
- **Cause**: Browser auto-play policy
- **Solution**: User must interact with page first (click something)

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Audio Not Loading
- Check files exist in `/public/sounds/`
- Check browser console for 404 errors
- Verify file paths are correct

## 📱 Testing on Mobile

### Local Network Testing
1. Find your local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
2. Start dev server: `npm run dev`
3. On mobile, visit: `http://YOUR_IP:3000`

### Example
```
http://192.168.1.100:3000
```

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Dev server starts successfully (`npm run dev`)
- [ ] Homepage loads with animations
- [ ] Both game mode buttons work
- [ ] Music toggle functions
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Build completes (`npm run build`)
- [ ] Production mode works (`npm start`)

## 🎯 Next Phase

This is Phase 1: Homepage + Audio System.

**Coming Next:**
- Ludo game board
- Game logic
- Player management
- AI opponent

For detailed project information, see `PROJECT_OVERVIEW.md` and `README.md`.

---

**Need Help?** Check the console for error messages or review the project documentation.
