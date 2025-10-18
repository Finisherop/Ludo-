"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Player, PlayerColor } from "@/lib/ludo-game";

interface LudoBoardProps {
  players: Player[];
  currentPlayerIndex: number;
  selectedPawn: number | null;
  onPawnClick: (playerIndex: number, pawnIndex: number) => void;
}

const COLOR_STYLES = {
  red: "bg-red-500 border-red-400 shadow-red-500/50",
  green: "bg-green-500 border-green-400 shadow-green-500/50",
  yellow: "bg-yellow-500 border-yellow-400 shadow-yellow-500/50",
  blue: "bg-blue-500 border-blue-400 shadow-blue-500/50"
};

const HOME_AREA_STYLES = {
  red: "bg-red-500/20 border-red-400/40",
  green: "bg-green-500/20 border-green-400/40",
  yellow: "bg-yellow-500/20 border-yellow-400/40",
  blue: "bg-blue-500/20 border-blue-400/40"
};

// Ludo board path coordinates (simplified for visual representation)
const BOARD_PATH = [
  // Bottom row (red to green)
  { x: 6, y: 8 }, { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 },
  { x: 0, y: 8 }, { x: 0, y: 7 }, { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 },
  { x: 4, y: 6 }, { x: 5, y: 6 },
  
  // Right column (green to yellow)
  { x: 6, y: 6 }, { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 },
  { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 },
  { x: 8, y: 4 }, { x: 8, y: 5 },
  
  // Top row (yellow to blue)
  { x: 8, y: 6 }, { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 },
  { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 },
  { x: 10, y: 8 }, { x: 9, y: 8 },
  
  // Left column (blue to red)
  { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 },
  { x: 8, y: 14 }, { x: 7, y: 14 }, { x: 6, y: 14 }, { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 },
  { x: 6, y: 10 }, { x: 6, y: 9 }
];

// Home stretch paths for each color
const HOME_STRETCH_PATHS = {
  red: [
    { x: 7, y: 8 }, { x: 7, y: 7 }, { x: 7, y: 6 }, { x: 7, y: 5 }, { x: 7, y: 4 }, { x: 7, y: 3 }
  ],
  green: [
    { x: 6, y: 7 }, { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 10, y: 7 }, { x: 11, y: 7 }
  ],
  yellow: [
    { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }, { x: 7, y: 11 }
  ],
  blue: [
    { x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }
  ]
};

// Safe positions (star positions)
const SAFE_POSITIONS = [1, 9, 14, 22, 27, 35, 40, 48];

function getPawnScreenPosition(player: Player, pawn: { position: number; isFinished: boolean }, pawnIndex: number): { x: number; y: number } {
  if (pawn.position === -1) {
    // Home position
    const homePositions = [
      { x: 1.5, y: 1.5 }, { x: 4.5, y: 1.5 }, { x: 1.5, y: 4.5 }, { x: 4.5, y: 4.5 }
    ];
    const playerHomeOffsets = {
      red: { x: 0, y: 9 },
      green: { x: 9, y: 0 },
      yellow: { x: 9, y: 9 },
      blue: { x: 0, y: 0 }
    };
    
    const offset = playerHomeOffsets[player.color];
    const homePos = homePositions[pawnIndex];
    
    return {
      x: (offset.x + homePos.x) * 6.67, // Convert to percentage
      y: (offset.y + homePos.y) * 6.67
    };
  }
  
  if (pawn.isFinished) {
    // Center position
    return { x: 46.67, y: 46.67 };
  }
  
  // Board position
  const pathIndex = pawn.position;
  let coordinates;
  
  if (pathIndex < 52) {
    // Regular path
    coordinates = BOARD_PATH[pathIndex % BOARD_PATH.length];
  } else {
    // Home stretch
    const homeStretchIndex = pathIndex - 52;
    coordinates = HOME_STRETCH_PATHS[player.color][homeStretchIndex];
  }
  
  return {
    x: coordinates.x * 6.67,
    y: coordinates.y * 6.67
  };
}

export function LudoBoard({ players, currentPlayerIndex, selectedPawn, onPawnClick }: LudoBoardProps) {
  return (
    <div className="relative">
      {/* Main Board Container */}
      <motion.div
        className="relative w-80 h-80 md:w-96 md:h-96 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Board Grid Background */}
        <div className="absolute inset-0 grid grid-cols-15 grid-rows-15 gap-px p-2">
          {Array.from({ length: 225 }, (_, i) => {
            const row = Math.floor(i / 15);
            const col = i % 15;
            
            // Determine cell type
            const isHomeArea = (row < 6 && col < 6) || (row < 6 && col > 8) || 
                             (row > 8 && col < 6) || (row > 8 && col > 8);
            const isCenterArea = row >= 6 && row <= 8 && col >= 6 && col <= 8;
            const isPath = !isHomeArea && !isCenterArea;
            
            // Determine home area color
            let homeColor: PlayerColor | null = null;
            if (row < 6 && col < 6) homeColor = "blue";
            else if (row < 6 && col > 8) homeColor = "green";
            else if (row > 8 && col < 6) homeColor = "red";
            else if (row > 8 && col > 8) homeColor = "yellow";
            
            return (
              <div
                key={i}
                className={cn(
                  "relative border border-white/5 rounded-sm",
                  isHomeArea && homeColor ? HOME_AREA_STYLES[homeColor] : "",
                  isCenterArea ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30" : "",
                  isPath ? "bg-white/10" : "",
                  // Add star markers for safe positions
                  isPath && SAFE_POSITIONS.includes(i % 52) ? "bg-yellow-400/30" : ""
                )}
              >
                {/* Star marker for safe positions */}
                {isPath && SAFE_POSITIONS.includes(i % 52) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-yellow-300 text-xs">⭐</span>
                  </div>
                )}
                
                {/* Center logo */}
                {isCenterArea && row === 7 && col === 7 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">🎲</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Home Area Labels */}
        <div className="absolute top-2 left-2 text-blue-300 text-xs font-bold">BLUE</div>
        <div className="absolute top-2 right-2 text-green-300 text-xs font-bold">GREEN</div>
        <div className="absolute bottom-2 left-2 text-red-300 text-xs font-bold">RED</div>
        <div className="absolute bottom-2 right-2 text-yellow-300 text-xs font-bold">YELLOW</div>

        {/* Pawns */}
        {players.map((player, playerIndex) =>
          player.pawns.map((pawn, pawnIndex) => {
            const position = getPawnScreenPosition(player, pawn, pawnIndex);
            const isCurrentPlayer = playerIndex === currentPlayerIndex;
            const isSelected = selectedPawn === pawnIndex && isCurrentPlayer;
            
            return (
              <motion.div
                key={`${player.id}-${pawn.id}`}
                className={cn(
                  "absolute w-6 h-6 md:w-7 md:h-7 rounded-full border-2 cursor-pointer z-20",
                  "flex items-center justify-center text-xs font-bold text-white",
                  COLOR_STYLES[player.color],
                  isSelected ? "ring-4 ring-white/50 scale-110" : "",
                  isCurrentPlayer ? "hover:scale-110" : ""
                )}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
                onClick={() => onPawnClick(playerIndex, pawnIndex)}
                whileHover={isCurrentPlayer ? { scale: 1.1 } : {}}
                whileTap={isCurrentPlayer ? { scale: 0.9 } : {}}
                animate={{
                  boxShadow: isCurrentPlayer && !pawn.isFinished
                    ? [
                        "0 0 0 0 rgba(255,255,255,0.5)",
                        "0 0 0 8px rgba(255,255,255,0)",
                        "0 0 0 0 rgba(255,255,255,0.5)"
                      ]
                    : "0 0 0 0 rgba(255,255,255,0)",
                  scale: isSelected ? 1.1 : 1
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  scale: {
                    duration: 0.2
                  }
                }}
                layout
                layoutId={`pawn-${player.id}-${pawn.id}`}
              >
                {pawn.isFinished ? "🏆" : pawnIndex + 1}
              </motion.div>
            );
          })
        )}

        {/* Path Indicators */}
        {BOARD_PATH.map((pathCell, index) => (
          <div
            key={`path-${index}`}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${pathCell.x * 6.67}%`,
              top: `${pathCell.y * 6.67}%`,
              transform: "translate(-50%, -50%)"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}