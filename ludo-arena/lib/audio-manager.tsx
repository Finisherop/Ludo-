"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  playSound: (soundName: "dice" | "move" | "win") => void;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const soundRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    setIsClient(true);
    
    // Initialize background music
    bgMusicRef.current = new Audio("/sounds/bg-music.mp3");
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.3;

    // Initialize sound effects
    soundRefs.current = {
      dice: new Audio("/sounds/dice.mp3"),
      move: new Audio("/sounds/move.mp3"),
      win: new Audio("/sounds/win.mp3"),
    };

    // Load music state from localStorage
    const savedMusicState = localStorage.getItem("musicEnabled");
    if (savedMusicState === "true") {
      setIsMusicPlaying(true);
      bgMusicRef.current.play().catch(() => {
        // Auto-play might be blocked, will play on user interaction
      });
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!bgMusicRef.current) return;

    if (isMusicPlaying) {
      bgMusicRef.current.pause();
      setIsMusicPlaying(false);
      localStorage.setItem("musicEnabled", "false");
    } else {
      bgMusicRef.current.play().catch((error) => {
        console.error("Failed to play music:", error);
      });
      setIsMusicPlaying(true);
      localStorage.setItem("musicEnabled", "true");
    }
  };

  const playSound = (soundName: "dice" | "move" | "win") => {
    const sound = soundRefs.current[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.volume = 0.5;
      sound.play().catch((error) => {
        console.error(`Failed to play ${soundName} sound:`, error);
      });
    }
  };

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <AudioContext.Provider value={{ playSound, isMusicPlaying, toggleMusic }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  // Provide default values during SSR
  if (context === undefined) {
    if (typeof window === "undefined") {
      return {
        playSound: () => {},
        isMusicPlaying: false,
        toggleMusic: () => {},
      };
    }
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
