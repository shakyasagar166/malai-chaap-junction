// Restaurant Counter Service Bell Synthesizer (Web Audio API)
// Provides clean, realistic dual-tone brass bell chime without any external audio files

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a realistic dual-chime restaurant counter bell ("Ding-Ding!")
 * Note 1: High crisp strike with metallic harmonic overtones
 * Note 2: Slightly higher resonant chime with long smooth decay
 */
export function playOrderBellSound() {
  if (typeof window === 'undefined') return;

  // Check mute preference
  const isEnabled = localStorage.getItem('mcj_bell_sound_enabled') !== 'false';
  if (!isEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Helper to strike a brass bell tone with fundamental + harmonic
    const strikeBell = (freq1, freq2, startTime, duration, gainLevel) => {
      // Primary Oscillator
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq1, startTime);

      // Higher Harmonic Oscillator for metallic brass shimmer
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq2, startTime);

      // Exponential decay envelope (realistic bell ring)
      gain1.gain.setValueAtTime(gainLevel, startTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      gain2.gain.setValueAtTime(gainLevel * 0.45, startTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + (duration * 0.7));

      osc1.connect(gain1);
      osc2.connect(gain2);

      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);

      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    };

    // First Bell Strike ("Ding") at 880Hz (A5) with 2200Hz harmonic
    strikeBell(880, 2200, now + 0.02, 1.2, 0.4);

    // Second Bell Strike ("Dong!") at 1174.6Hz (D6) with 2936Hz harmonic, slightly louder and longer ring
    strikeBell(1174.66, 2936, now + 0.22, 1.8, 0.55);

    // Vibration on mobile devices / POS tablets
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 80, 250]);
    }
  } catch (err) {
    console.warn('Could not play order bell sound:', err);
  }
}

/**
 * Test chime triggered manually by admin button
 */
export function testBellSound() {
  playOrderBellSound();
}

/**
 * Check if bell sound is currently enabled
 */
export function isBellSoundEnabled() {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('mcj_bell_sound_enabled') !== 'false';
}

/**
 * Toggle bell sound on / off
 */
export function toggleBellSound() {
  if (typeof window === 'undefined') return true;
  const current = isBellSoundEnabled();
  const next = !current;
  localStorage.setItem('mcj_bell_sound_enabled', next ? 'true' : 'false');
  if (next) {
    playOrderBellSound(); // play quick confirmation chime
  }
  return next;
}
