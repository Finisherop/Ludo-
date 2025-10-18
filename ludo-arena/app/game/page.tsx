"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
import { Volume2, VolumeX, RotateCcw, Home } from "lucide-react";
import { useAudio } from "@/lib/audio-manager";
import { cn } from "@/lib/utils";
import { LudoBoard } from "@/components/ludo-board";
import { Confetti } from "@/components/confetti";
import {
  GameState,
  initializeGame,
  movePawn as moveGamePawn,
  getMovablePawns,
  getComputerMove
} from "@/lib/ludo-game";

export const dynamic = "force-dynamic";

const COLOR_STYLES = {
  red: "bg-red-500 border-red-400 shadow-red-500/50",
  green: "bg-green-500 border-green-400 shadow-green-500/50",
  yellow: "bg-yellow-500 border-yellow-400 shadow-yellow-500/50",
  blue: "bg-blue-500 border-blue-400 shadow-blue-500/50"
};

function GamePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isMusicPlaying, toggleMusic, playSound } = useAudio();
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedPawn, setSelectedPawn] = useState<number | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // Initialize game
  useEffect(() => {
    const mode = (searchParams.get("mode") || localStorage.getItem("gameMode") || "local") as "computer" | "local";
    const numPlayers = parseInt(searchParams.get("players") || localStorage.getItem("numPlayers") || "2");
    
    const newGameState = initializeGame(numPlayers, mode);
    setGameState(newGameState);
  }, [searchParams]);

  // Dice roll function
  const rollDice = useCallback(() => {
    if (!gameState || gameState.isRolling || gameState.gamePhase !== "rolling") return;

    setGameState(prev => prev ? { ...prev, isRolling: true } : null);
    playSound("dice");

    // Simulate dice roll animation
    setTimeout(() => {
      const diceValue = Math.floor(Math.random() * 6) + 1;
      
      setGameState(prev => {
        if (!prev) return null;
        
        const newConsecutiveSixes = diceValue === 6 ? prev.consecutiveSixes + 1 : 0;
        
        // Check for three consecutive sixes (turn ends)
        if (newConsecutiveSixes >= 3) {
          return {
            ...prev,
            diceValue,
            isRolling: false,
            consecutiveSixes: 0,
            gamePhase: "rolling",
            currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length
          };
        }

        return {
          ...prev,
          diceValue,
          isRolling: false,
          consecutiveSixes: newConsecutiveSixes,
          gamePhase: "moving"
        };
      });
    }, 1000);
  }, [gameState, playSound]);

  // Move pawn function
  const movePawn = useCallback((pawnIndex: number) => {
    if (!gameState || gameState.gamePhase !== "moving") return;

    const newGameState = moveGamePawn(gameState, gameState.currentPlayerIndex, pawnIndex);
    
    if (newGameState !== gameState) {
      playSound("move");
      
      if (newGameState.winner) {
        playSound("win");
        setTimeout(() => setShowWinnerModal(true), 500);
      }
      
      setGameState(newGameState);
    }

    setSelectedPawn(null);
  }, [gameState, playSound]);

  // Computer AI move
  useEffect(() => {
    if (!gameState || gameState.gamePhase !== "rolling") return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer.isComputer) return;

    // Auto-roll for computer
    setTimeout(() => {
      rollDice();
    }, 1000);
  }, [gameState, rollDice]);

  useEffect(() => {
    if (!gameState || gameState.gamePhase !== "moving") return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer.isComputer) return;

    // Auto-move for computer using AI
    setTimeout(() => {
      const bestMove = getComputerMove(currentPlayer, gameState.diceValue);
      if (bestMove !== -1) {
        movePawn(bestMove);
      } else {
        // No valid moves, end turn
        setGameState(prev => prev ? {
          ...prev,
          gamePhase: "rolling",
          currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
          consecutiveSixes: 0
        } : null);
      }
    }, 1500);
  }, [gameState, movePawn]);

  // Handle pawn click
  const handlePawnClick = useCallback((playerIndex: number, pawnIndex: number) => {
    if (!gameState || playerIndex !== gameState.currentPlayerIndex) return;
    
    const currentPlayer = gameState.players[playerIndex];
    if (currentPlayer.isComputer) return;
    
    if (gameState.gamePhase === "moving") {
      const movablePawns = getMovablePawns(currentPlayer, gameState.diceValue);
      if (movablePawns.includes(pawnIndex)) {
        movePawn(pawnIndex);
      }
    } else {
      setSelectedPawn(pawnIndex);
    }
  }, [gameState, movePawn]);

  const restartGame = () => {
    setShowWinnerModal(false);
    router.push("/select");
  };

  const goHome = () => {
    router.push("/");
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading game...</div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 1, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 60 + 30,
              height: Math.random() * 60 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Music Toggle */}
      <motion.button
        onClick={toggleMusic}
        className={cn(
          "absolute top-4 right-4 z-50 p-3 rounded-full backdrop-blur-md border border-white/20",
          "shadow-lg",
          isMusicPlaying
            ? "bg-purple-500/30 hover:bg-purple-500/40"
            : "bg-gray-500/30 hover:bg-gray-500/40"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMusicPlaying ? (
          <Volume2 className="w-5 h-5 text-white" />
        ) : (
          <VolumeX className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* Game Controls */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <motion.button
          onClick={goHome}
          className="p-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-5 h-5 text-white" />
        </motion.button>
        
        <motion.button
          onClick={restartGame}
          className="p-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        
        {/* Turn Indicator */}
        <motion.div
          className="mb-6 text-center"
          key={currentPlayer.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={cn(
            "inline-flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-md border-2",
            "shadow-lg font-bold text-white text-lg",
            `border-${currentPlayer.color}-400/60 bg-${currentPlayer.color}-500/20`
          )}>
            <div className={cn("w-4 h-4 rounded-full", COLOR_STYLES[currentPlayer.color])} />
            {currentPlayer.name}&apos;s Turn
          </div>
        </motion.div>

        {/* Game Board */}
        <div className="relative">
          <LudoBoard
            players={gameState.players}
            currentPlayerIndex={gameState.currentPlayerIndex}
            selectedPawn={selectedPawn}
            onPawnClick={handlePawnClick}
          />

          {/* Dice */}
          <motion.div
            className="absolute -right-24 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex flex-col items-center gap-4">
              {/* Dice Display */}
              <motion.div
                className="w-16 h-16 bg-white rounded-xl shadow-2xl flex items-center justify-center text-3xl font-bold"
                animate={gameState.isRolling ? {
                  rotateX: [0, 360, 720, 1080],
                  rotateY: [0, 360, 720, 1080],
                } : {}}
                transition={{
                  duration: 1,
                  ease: "easeOut"
                }}
              >
                {gameState.isRolling ? "🎲" : gameState.diceValue || "🎲"}
              </motion.div>

              {/* Roll Button */}
              {gameState.gamePhase === "rolling" && !currentPlayer.isComputer && (
                <motion.button
                  onClick={rollDice}
                  disabled={gameState.isRolling}
                  className={cn(
                    "px-4 py-2 rounded-xl font-bold text-white backdrop-blur-md border-2",
                    "shadow-lg transition-all duration-300",
                    gameState.isRolling
                      ? "bg-gray-500/30 border-gray-400/60 cursor-not-allowed"
                      : "bg-purple-500/30 border-purple-400/60 hover:bg-purple-500/40"
                  )}
                  whileHover={!gameState.isRolling ? { scale: 1.05 } : {}}
                  whileTap={!gameState.isRolling ? { scale: 0.95 } : {}}
                >
                  {gameState.isRolling ? "Rolling..." : "Roll Dice"}
                </motion.button>
              )}

              {/* Move Instruction */}
              {gameState.gamePhase === "moving" && !currentPlayer.isComputer && (
                <motion.div
                  className="text-center text-white/80 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Click a pawn to move
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Player Status */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {gameState.players.map((player) => {
            const finishedPawns = player.pawns.filter(p => p.isFinished).length;
            
            return (
              <div
                key={player.id}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border",
                  "text-white text-sm",
                  player.id === gameState.currentPlayerIndex
                    ? `border-${player.color}-400/60 bg-${player.color}-500/20`
                    : "border-white/20 bg-white/10"
                )}
              >
                <div className={cn("w-3 h-3 rounded-full", COLOR_STYLES[player.color])} />
                <span>{player.name}</span>
                <span className="text-xs opacity-80">({finishedPawns}/4)</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Confetti Animation */}
      <Confetti isActive={showWinnerModal && !!gameState.winner} />

      {/* Winner Modal */}
      <AnimatePresence>
        {showWinnerModal && gameState.winner && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-center shadow-2xl border border-white/20 max-w-md mx-4"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🏆
              </motion.div>
              
              <motion.h2
                className="text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {gameState.winner.name} Wins!
              </motion.h2>
              
              <motion.div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${COLOR_STYLES[gameState.winner.color]} bg-opacity-30`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className={`w-4 h-4 rounded-full ${COLOR_STYLES[gameState.winner.color]}`} />
                <span className="text-white font-semibold">{gameState.winner.color.toUpperCase()}</span>
              </motion.div>
              
              <motion.p
                className="text-white/80 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                🎉 Congratulations on your victory! 🎉
              </motion.p>
              
              <motion.div
                className="flex gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={restartGame}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-bold border border-white/40 transition-all duration-300"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 Play Again
                </motion.button>
                
                <motion.button
                  onClick={goHome}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-bold border border-white/40 transition-all duration-300"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  🏠 Home
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading game...</div>
      </div>
    }>
      <GamePageContent />
    </Suspense>
  );
}