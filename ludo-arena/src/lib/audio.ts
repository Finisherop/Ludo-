class AudioManager {
  private backgroundMusic: HTMLAudioElement | null = null;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio() {
    // Create audio elements for different sounds
    const soundFiles = {
      diceRoll: '/sounds/dice-roll.mp3',
      pawnMove: '/sounds/pawn-move.mp3',
      win: '/sounds/win.mp3',
      background: '/sounds/background.mp3',
    };

    // Create audio elements
    Object.entries(soundFiles).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = key === 'background' ? 0.3 : 0.7;
      this.sounds.set(key, audio);
    });

    this.backgroundMusic = this.sounds.get('background') || null;
  }

  playSound(soundName: string) {
    if (this.isMuted) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore audio play errors (browser restrictions)
      });
    }
  }

  playBackgroundMusic() {
    if (this.isMuted || !this.backgroundMusic) return;
    
    this.backgroundMusic.loop = true;
    this.backgroundMusic.play().catch(() => {
      // Ignore audio play errors (browser restrictions)
    });
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.stopBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
    
    return this.isMuted;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    
    if (muted) {
      this.stopBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
  }

  isAudioMuted(): boolean {
    return this.isMuted;
  }
}

// Create singleton instance
export const audioManager = new AudioManager();

// Generate simple audio data URLs for sounds
export function generateAudioDataURL(type: 'dice' | 'move' | 'win' | 'background'): string {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = type === 'background' ? 10 : 0.5; // 10 seconds for background, 0.5 for others
  const length = sampleRate * duration;
  const buffer = audioContext.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    let value = 0;

    switch (type) {
      case 'dice':
        // Dice roll sound - quick burst of noise
        value = Math.random() * 0.3 * Math.exp(-t * 10);
        break;
      case 'move':
        // Pawn move sound - short click
        value = Math.sin(2 * Math.PI * 800 * t) * 0.2 * Math.exp(-t * 8);
        break;
      case 'win':
        // Win sound - ascending tone
        value = Math.sin(2 * Math.PI * (440 + t * 200) * t) * 0.3 * Math.exp(-t * 2);
        break;
      case 'background':
        // Background music - ambient loop
        value = Math.sin(2 * Math.PI * 220 * t) * 0.1 + 
                Math.sin(2 * Math.PI * 330 * t) * 0.05 +
                Math.sin(2 * Math.PI * 440 * t) * 0.03;
        break;
    }

    data[i] = value;
  }

  // Convert to WAV format
  const wavBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(wavBuffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);
  
  // Convert float to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }
  
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}