"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/lib/audio-manager";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function SelectPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isMusicPlaying, toggleMusic } = useAudio();
  const [mode, setMode] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<number | null>(null);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    const storedMode = localStorage.getItem("gameMode");
    setMode(modeParam || storedMode);
  }, [searchParams]);

  const handlePlayerSelect = (numPlayers: number) => {
    setSelectedPlayers(numPlayers);
  };

  const handleStartGame = () => {
    if (!selectedPlayers || !mode) return;
    
    // Save game settings to localStorage
    localStorage.setItem("numPlayers", selectedPlayers.toString());
    localStorage.setItem("gameMode", mode);
    
    // Navigate to game
    router.push(`/game?mode=${mode}&players=${selectedPlayers}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-red-500 via-yellow-500 to-green-500 mix-blend-multiply"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-bl from-purple-500 via-blue-500 to-green-500 mix-blend-screen"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 150 - 75],
              y: [0, Math.random() * 150 - 75],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Music Toggle Button */}
      <motion.button
        onClick={toggleMusic}
        className={cn(
          "absolute top-6 right-6 z-50 p-4 rounded-full backdrop-blur-md border border-white/20",
          "shadow-lg shadow-purple-500/50",
          isMusicPlaying
            ? "bg-purple-500/30 hover:bg-purple-500/40"
            : "bg-gray-500/30 hover:bg-gray-500/40"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={
            isMusicPlaying
              ? {
                  boxShadow: [
                    "0 0 20px rgba(168, 85, 247, 0.5)",
                    "0 0 40px rgba(168, 85, 247, 0.8)",
                    "0 0 20px rgba(168, 85, 247, 0.5)",
                  ],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="rounded-full"
        >
          {isMusicPlaying ? (
            <Volume2 className="w-6 h-6 text-white" />
          ) : (
            <VolumeX className="w-6 h-6 text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="text-center backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl w-full"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Select Number of Players
          </motion.h1>
          
          <motion.p
            className="text-lg text-white/80 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {mode === "computer" ? "🧠 Playing vs Computer" : "🧍 Local Multiplayer"}
          </motion.p>

          {/* Player Count Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            {[2, 3, 4].map((numPlayers, index) => (
              <motion.button
                key={numPlayers}
                onClick={() => handlePlayerSelect(numPlayers)}
                className={cn(
                  "relative px-6 py-4 rounded-2xl backdrop-blur-md border-2 transition-all duration-300",
                  "shadow-lg overflow-hidden group",
                  selectedPlayers === numPlayers
                    ? "bg-gradient-to-r from-purple-500/40 to-pink-500/40 border-purple-400/60 shadow-purple-500/50"
                    : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/40"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              >
                {/* Selection Ring Animation */}
                {selectedPlayers === numPlayers && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-purple-400"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                
                <div className="relative flex flex-col items-center gap-2">
                  <span className="text-3xl">
                    {numPlayers === 2 ? "2️⃣" : numPlayers === 3 ? "3️⃣" : "4️⃣"}
                  </span>
                  <span className="text-xl font-bold text-white">
                    {numPlayers} Players
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Start Game Button */}
          <motion.button
            onClick={handleStartGame}
            disabled={!selectedPlayers}
            className={cn(
              "relative px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300",
              "backdrop-blur-md border-2 overflow-hidden group",
              selectedPlayers
                ? "bg-gradient-to-r from-green-500/30 to-blue-500/30 border-green-400/60 text-white hover:from-green-500/40 hover:to-blue-500/40 shadow-lg shadow-green-500/30"
                : "bg-gray-500/20 border-gray-500/40 text-gray-400 cursor-not-allowed"
            )}
            whileHover={selectedPlayers ? { scale: 1.05 } : {}}
            whileTap={selectedPlayers ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {selectedPlayers && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20"
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            <span className="relative">🚀 Start Game</span>
          </motion.button>

          {/* Back Button */}
          <motion.button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            ← Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default function SelectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <SelectPageContent />
    </Suspense>
  );
}
