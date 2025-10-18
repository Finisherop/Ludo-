'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audio';

export default function PlayerSelectionPage() {
  const router = useRouter();
  const [selectedPlayers, setSelectedPlayers] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Load mute state from localStorage
    const savedMuteState = localStorage.getItem('ludo-arena-muted');
    if (savedMuteState) {
      const muted = JSON.parse(savedMuteState);
      setIsMuted(muted);
      audioManager.setMuted(muted);
    }
  }, []);

  const handlePlayerSelect = (numPlayers: number) => {
    setSelectedPlayers(numPlayers);
    audioManager.playSound('pawn-move');
  };

  const handleStartGame = () => {
    if (selectedPlayers) {
      // Save player count to localStorage
      localStorage.setItem('ludo-arena-players', selectedPlayers.toString());
      
      // Get mode from localStorage
      const mode = localStorage.getItem('ludo-arena-mode') || 'local';
      
      // Navigate to game
      router.push(`/game?mode=${mode}&players=${selectedPlayers}`);
    }
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
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
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

      {/* Back Button */}
      <motion.button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-10 p-3 rounded-full bg-black/20 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-cyan-300">
            Select Number of Players
          </h1>
          <p className="text-lg text-cyan-400/70">
            Choose how many players will join the battle
          </p>
        </motion.div>

        {/* Player Selection Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-black/20 backdrop-blur-md rounded-3xl p-8 border border-cyan-400/30 shadow-2xl"
        >
          {/* Player Count Buttons */}
          <div className="flex gap-6 mb-8">
            {[2, 3, 4].map((numPlayers) => (
              <motion.button
                key={numPlayers}
                onClick={() => handlePlayerSelect(numPlayers)}
                className={`relative px-8 py-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedPlayers === numPlayers
                    ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                    : 'border-cyan-400/30 bg-black/10 hover:border-cyan-400/60 hover:bg-cyan-400/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-4xl mb-2">
                  {numPlayers === 2 && '2️⃣'}
                  {numPlayers === 3 && '3️⃣'}
                  {numPlayers === 4 && '4️⃣'}
                </div>
                <div className={`text-xl font-bold ${
                  selectedPlayers === numPlayers ? 'text-cyan-300' : 'text-cyan-400'
                }`}>
                  {numPlayers} Players
                </div>
                
                {/* Selection Ring Animation */}
                {selectedPlayers === numPlayers && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-cyan-400"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.1, opacity: 0.6 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Start Game Button */}
          <motion.button
            onClick={handleStartGame}
            disabled={!selectedPlayers}
            className={`w-full py-4 px-8 rounded-2xl font-bold text-xl transition-all duration-300 ${
              selectedPlayers
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={selectedPlayers ? { scale: 1.02 } : {}}
            whileTap={selectedPlayers ? { scale: 0.98 } : {}}
          >
            {selectedPlayers ? 'Start Game' : 'Select Players First'}
          </motion.button>
        </motion.div>

        {/* Game Mode Display */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-cyan-400/60 text-sm">
            Mode: {localStorage.getItem('ludo-arena-mode') === 'computer' ? 'vs Computer' : 'Local Multiplayer'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}