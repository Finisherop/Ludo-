'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';

export default function HomePage() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Start background music on page load
    audioManager.playBackgroundMusic();
    
    // Load mute state from localStorage
    const savedMuteState = localStorage.getItem('ludo-arena-muted');
    if (savedMuteState) {
      const muted = JSON.parse(savedMuteState);
      setIsMuted(muted);
      audioManager.setMuted(muted);
    }
  }, []);

  const handleModeSelect = (mode: 'computer' | 'local') => {
    // Save mode to localStorage
    localStorage.setItem('ludo-arena-mode', mode);
    
    // Navigate to player selection
    router.push('/select');
  };

  const toggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
    localStorage.setItem('ludo-arena-muted', JSON.stringify(newMutedState));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-900 via-red-900 to-yellow-900 opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-green-900 via-emerald-900 to-teal-900 opacity-20"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Music Toggle */}
      <motion.button
        onClick={toggleMute}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-black/20 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMuted ? (
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-8xl md:text-9xl font-bold mb-6"
            style={{
              background: 'linear-gradient(45deg, #00ffff, #ff007f, #ffea00, #00ff6a, #8a2be2)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            🎲 Ludo Arena
          </motion.h1>
          
          <motion.p
            className="text-2xl md:text-3xl text-cyan-300 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{
              textShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
            }}
          >
            Choose your battle mode
          </motion.p>
        </motion.div>

        {/* Mode Selection Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {/* Computer Mode Button */}
          <motion.button
            onClick={() => handleModeSelect('computer')}
            className="group relative px-12 py-6 rounded-2xl bg-black/20 backdrop-blur-md border-2 border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 overflow-hidden"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="text-6xl">🧠</div>
              <div className="text-2xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                Play vs Computer
              </div>
              <div className="text-sm text-cyan-400/70 group-hover:text-cyan-400/90 transition-colors">
                Challenge the AI
              </div>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>

          {/* Local Mode Button */}
          <motion.button
            onClick={() => handleModeSelect('local')}
            className="group relative px-12 py-6 rounded-2xl bg-black/20 backdrop-blur-md border-2 border-pink-400/30 hover:border-pink-400/60 transition-all duration-300 overflow-hidden"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <div className="text-6xl">🧍</div>
              <div className="text-2xl font-bold text-pink-300 group-hover:text-pink-200 transition-colors">
                Play with Friends
              </div>
              <div className="text-sm text-pink-400/70 group-hover:text-pink-400/90 transition-colors">
                Local Multiplayer
              </div>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center text-cyan-400/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <p>Experience the ultimate offline Ludo adventure</p>
        </motion.div>
      </div>
    </div>
  );
}