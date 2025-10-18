# 🎲 Ludo Arena

A modern, offline-ready Ludo game built with Next.js 15, featuring stunning animations and an immersive gaming experience.

## ✨ Features

- 🎨 **Modern Glowing UI** - Beautiful animated gradients with neon glassmorphism effects
- 🎭 **Framer Motion Animations** - Smooth, responsive animations throughout
- 🔊 **Audio System** - Background music and sound effects with persistent controls
- 📱 **Fully Responsive** - Works beautifully on mobile and desktop
- 🌐 **PWA Ready** - Installable and works offline
- 🎮 **Two Game Modes**:
  - Play vs Computer (AI)
  - Play with Friends (Local Multiplayer)

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
npm start
```

## 🎵 Audio Files

The app expects audio files in `/public/sounds/`:
- `bg-music.mp3` - Background music (loops)
- `dice.mp3` - Dice roll sound
- `move.mp3` - Piece move sound
- `win.mp3` - Victory sound

Currently, placeholder files are included. Replace them with actual audio files for production.

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Beautiful UI components
- **Lucide React** - Icon library

## 📁 Project Structure

```
ludo-arena/
├── app/
│   ├── page.tsx          # Homepage with game mode selection
│   ├── select/page.tsx   # Player selection page
│   ├── layout.tsx        # Root layout with providers
│   └── globals.css       # Global styles
├── components/
│   └── button.tsx        # Reusable button component
├── lib/
│   ├── audio-manager.tsx # Audio context and hook
│   ├── pwa-register.tsx  # PWA service worker registration
│   └── utils.ts          # Utility functions
└── public/
    ├── sounds/           # Audio files
    ├── manifest.json     # PWA manifest
    └── sw.js            # Service worker

```

## 🎮 Game Features (Homepage)

- Fullscreen animated gradient background (blue, red, yellow, green, purple)
- Glassmorphism title with neon glow and pulse animation
- Floating particle effects
- Two interactive game mode buttons with hover animations
- Music toggle with persistent state (localStorage)
- Smooth page transitions
- Game mode stored in localStorage

## 🔄 Next Steps

This is the homepage foundation. Future updates will include:
- Complete player selection UI
- Ludo board implementation
- Game logic and rules
- AI for computer opponent
- Multiplayer game state management
- Additional sound effects and music tracks

## 📄 License

MIT

## 👨‍💻 Development

Built with ❤️ using modern web technologies.
