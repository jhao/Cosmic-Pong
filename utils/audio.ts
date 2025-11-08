let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  // Fix: Add type assertion to handle legacy 'webkitAudioContext' for older browsers.
  if (window.AudioContext || (window as any).webkitAudioContext) {
      if (!audioContext) {
          audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      // Resume context on user interaction if it's suspended
      if (audioContext.state === 'suspended') {
          audioContext.resume();
      }
      return audioContext;
  }
  return null;
}

// Function to play a simple tone
const playTone = (freq: number, duration: number, volume: number = 0.5) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
}

export const playHitSound = () => {
    playTone(440, 0.05, 0.3); // A short 'blip'
};

export const playWinSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    playTone(523.25, 0.1); // C5
    setTimeout(() => playTone(659.25, 0.1), 100); // E5
};

export const playLoseSound = () => {
    playTone(220, 0.2, 0.4); // A low 'buzz'
};

// This should be called on the first user interaction (e.g., first tap to serve)
export const initAudio = () => {
    getAudioContext();
}