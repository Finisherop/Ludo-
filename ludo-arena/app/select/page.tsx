"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

export const dynamic = "force-dynamic";

function SelectPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    const storedMode = localStorage.getItem("gameMode");
    setMode(modeParam || storedMode);
  }, [searchParams]);

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
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="text-center backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {mode === "computer" ? "🧠 VS Computer" : "🧍 Local Multiplayer"}
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Player selection and game setup will be added here
          </p>
          <motion.button
            onClick={() => router.push("/")}
            className="px-8 py-4 rounded-xl bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
