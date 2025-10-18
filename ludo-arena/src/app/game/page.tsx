'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { audioManager } from '@/lib/audio';
import { GameState, Player, Pawn, PlayerColor } from '@/types/game';
import { 
  createInitialGameState, 
  rollDice, 
  movePawn, 
  nextTurn, 
  getValidMoves,
  getComputerMove 
} from '@/lib/gameLogic';

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'computer' | 'local' || 'local';
  const players = parseInt(searchParams.get('players') || '2');

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    // Initialize game state
    const initialState = createInitialGameState(mode, players);
    setGameState(initialState);

    // Load mute state
    const savedMuteState = localStorage.getItem('ludo-arena-muted');
    if (savedMuteState) {
      const muted = JSON.parse(savedMuteState);
      setIsMuted(muted);
      audioManager.setMuted(muted);
    }
  }, [mode, players]);

  useEffect(() => {
    // Handle computer turns
    if (gameState && gameState.players[gameState.currentPlayerIndex].isComputer && gameState.canRollDice) {
      const timer = setTimeout(() => {
        handleRollDice();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleRollDice = useCallback(() => {
    if (!gameState || !gameState.canRollDice || isRolling) return;

    setIsRolling(true);
    audioManager.playSound('dice-roll');

    setTimeout(() => {
      const diceValue = rollDice();
      setGameState(prev => prev ? { ...prev, diceValue, canRollDice: false } : null);
      setIsRolling(false);
    }, 1000);
  }, [gameState, isRolling]);

  const handlePawnClick = useCallback((pawn: Pawn, playerId: number) => {
    if (!gameState || gameState.canRollDice || !getValidMoves(gameState, pawn)) return;

    audioManager.playSound('pawn-move');
    const newState = movePawn(gameState, pawn.id, playerId);
    setGameState(newState);

    if (newState.isGameOver) {
      audioManager.playSound('win');
      setShowWinner(true);
    } else {
      // Move to next turn after a short delay
      setTimeout(() => {
        setGameState(prev => prev ? nextTurn(prev) : null);
      }, 1000);
    }
  }, [gameState]);

  const toggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
    localStorage.setItem('ludo-arena-muted', JSON.stringify(newMutedState));
  };

  const resetGame = () => {
    const initialState = createInitialGameState(mode, players);
    setGameState(initialState);
    setShowWinner(false);
  };

  const goHome = () => {
    router.push('/');
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const validMoves = currentPlayer.pawns.filter(pawn => getValidMoves(gameState, pawn));

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-900 via-red-900 to-yellow-900 opacity-20"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <motion.button
          onClick={goHome}
          className="p-3 rounded-full bg-black/20 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </motion.button>

        <motion.button
          onClick={toggleMute}
          className="p-3 rounded-full bg-black/20 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
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
      </div>

      {/* Game Board */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Current Player Info */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-cyan-300 mb-2">
            {currentPlayer.name}'s Turn
          </h2>
          <div className="text-lg text-cyan-400/70">
            {gameState.diceValue > 0 ? `Dice: ${gameState.diceValue}` : 'Roll the dice to start'}
          </div>
        </motion.div>

        {/* Ludo Board */}
        <motion.div
          className="relative w-96 h-96 bg-black/20 backdrop-blur-sm rounded-3xl border border-cyan-400/30 p-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Board Grid */}
          <div className="grid grid-cols-13 grid-rows-13 gap-1 h-full">
            {Array.from({ length: 169 }).map((_, index) => {
              const row = Math.floor(index / 13);
              const col = index % 13;
              const isCenter = row >= 4 && row <= 8 && col >= 4 && col <= 8;
              const isPath = !isCenter && (
                (row === 6 && col >= 0 && col <= 12) ||
                (col === 6 && row >= 0 && row <= 12) ||
                (row === 0 && col === 6) ||
                (row === 12 && col === 6) ||
                (col === 0 && row === 6) ||
                (col === 12 && row === 6)
              );

              return (
                <div
                  key={index}
                  className={`rounded ${
                    isCenter
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30'
                      : isPath
                      ? 'bg-gray-700/50 border border-gray-600/30'
                      : 'bg-gray-800/30'
                  }`}
                />
              );
            })}
          </div>

          {/* Pawns */}
          {gameState.players.map((player, playerIndex) => (
            <div key={player.id} className="absolute inset-4">
              {player.pawns.map((pawn, pawnIndex) => {
                const isHome = pawn.position === 0;
                const isInPlay = pawn.position > 0 && pawn.position < 57;
                const isHomePath = pawn.position >= 57;

                let position = { x: 0, y: 0 };
                if (isHome) {
                  // Home area positions
                  const homePositions = {
                    red: { x: 1, y: 1 },
                    blue: { x: 11, y: 1 },
                    green: { x: 11, y: 11 },
                    yellow: { x: 1, y: 11 },
                  };
                  position = homePositions[pawn.color];
                } else if (isInPlay) {
                  // Board path positions (simplified)
                  position = { x: 6, y: 6 }; // Center for now
                } else if (isHomePath) {
                  // Home path positions
                  position = { x: 6, y: 6 }; // Center for now
                }

                return (
                  <motion.div
                    key={pawn.id}
                    className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer ${
                      pawn.color === 'red' ? 'bg-red-500 border-red-400' :
                      pawn.color === 'blue' ? 'bg-blue-500 border-blue-400' :
                      pawn.color === 'green' ? 'bg-green-500 border-green-400' :
                      'bg-yellow-500 border-yellow-400'
                    } ${
                      getValidMoves(gameState, pawn) ? 'shadow-lg shadow-cyan-400/50' : ''
                    }`}
                    style={{
                      left: `${position.x * 28}px`,
                      top: `${position.y * 28}px`,
                    }}
                    onClick={() => handlePawnClick(pawn, playerIndex)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                      boxShadow: getValidMoves(gameState, pawn) 
                        ? ['0 0 20px rgba(0, 255, 255, 0.5)', '0 0 30px rgba(0, 255, 255, 0.8)', '0 0 20px rgba(0, 255, 255, 0.5)']
                        : '0 0 0px rgba(0, 255, 255, 0)',
                    }}
                    transition={{
                      boxShadow: {
                        duration: 1,
                        repeat: getValidMoves(gameState, pawn) ? Infinity : 0,
                      },
                    }}
                  />
                );
              })}
            </div>
          ))}
        </motion.div>

        {/* Dice and Controls */}
        <motion.div
          className="mt-8 flex flex-col items-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Dice */}
          <motion.button
            onClick={handleRollDice}
            disabled={!gameState.canRollDice || isRolling}
            className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-3xl font-bold transition-all duration-300 ${
              gameState.canRollDice && !isRolling
                ? 'bg-gradient-to-br from-cyan-500 to-blue-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
                : 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={gameState.canRollDice && !isRolling ? { scale: 1.05 } : {}}
            whileTap={gameState.canRollDice && !isRolling ? { scale: 0.95 } : {}}
            animate={isRolling ? { rotate: [0, 360] } : {}}
            transition={isRolling ? { duration: 1, repeat: Infinity } : {}}
          >
            {isRolling ? '🎲' : gameState.diceValue || '🎲'}
          </motion.button>

          {/* Roll Button */}
          <motion.button
            onClick={handleRollDice}
            disabled={!gameState.canRollDice || isRolling}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
              gameState.canRollDice && !isRolling
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={gameState.canRollDice && !isRolling ? { scale: 1.02 } : {}}
            whileTap={gameState.canRollDice && !isRolling ? { scale: 0.98 } : {}}
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </motion.button>
        </motion.div>
      </div>

      {/* Winner Modal */}
      <AnimatePresence>
        {showWinner && gameState.winner && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/80 backdrop-blur-md rounded-3xl p-8 border border-cyan-400/30 text-center max-w-md mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-cyan-300 mb-4">
                {gameState.winner.name} Wins!
              </h2>
              <p className="text-cyan-400/70 mb-6">
                Congratulations on your victory!
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg shadow-cyan-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play Again
                </motion.button>
                <motion.button
                  onClick={goHome}
                  className="px-6 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Home
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}