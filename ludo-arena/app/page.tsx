"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/lib/audio-manager";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const router = useRouter();
  const { isMusicPlaying, toggleMusic } = useAudio();

  const handleModeSelect = (mode: "computer" | "local") => {
    localStorage.setItem("gameMode", mode);
    router.push(`/select?mode=${mode}`);
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
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
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
        transition={{ delay: 0.5 }}
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title with Glassmorphism */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-4 px-8 py-4 rounded-3xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl"
            style={{
              textShadow: `
                0 0 10px rgba(139, 92, 246, 0.8),
                0 0 20px rgba(139, 92, 246, 0.6),
                0 0 30px rgba(139, 92, 246, 0.4),
                0 0 40px rgba(139, 92, 246, 0.3)
              `,
            }}
            animate={{
              textShadow: [
                `0 0 10px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)`,
                `0 0 20px rgba(139, 92, 246, 1), 0 0 30px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.6)`,
                `0 0 10px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)`,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-white">🎲 Ludo Arena</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/90 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Choose your battle mode
          </motion.p>
        </motion.div>

        {/* Game Mode Buttons */}
        <div className="flex flex-col gap-6 w-full max-w-md">
          <motion.button
            onClick={() => handleModeSelect("computer")}
            className="group relative px-8 py-6 md:px-12 md:py-8 rounded-2xl backdrop-blur-md bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-white/30 shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-30"
              transition={{ duration: 0.3 }}
            />
            <div className="relative flex items-center justify-center gap-4">
              <span className="text-4xl">🧠</span>
              <span className="text-2xl md:text-3xl font-bold text-white">
                Play vs Computer
              </span>
            </div>
          </motion.button>

          <motion.button
            onClick={() => handleModeSelect("local")}
            className="group relative px-8 py-6 md:px-12 md:py-8 rounded-2xl backdrop-blur-md bg-gradient-to-r from-green-500/30 to-yellow-500/30 border-2 border-white/30 shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 opacity-0 group-hover:opacity-30"
              transition={{ duration: 0.3 }}
            />
            <div className="relative flex items-center justify-center gap-4">
              <span className="text-4xl">🧍</span>
              <span className="text-2xl md:text-3xl font-bold text-white">
                Play with Friends
              </span>
            </div>
            <p className="relative text-sm text-white/80 mt-2">(Local)</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
