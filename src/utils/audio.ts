import type { MotionType, VerbItem } from '../data/verbs';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextCtor) {
      audioCtx = new AudioContextCtor();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Synthesizes a tactile, kinesthetic percussive cue matching the group's physical anchor:
 * - palm-strike / three-step-heel: crisp low wood/table thud
 * - step-twin-clap: snappy double clap burst on beats 2 & 3
 * - vocal-ladder: descending musical chime (High -> Mid -> Low)
 * - wind-push / throat-dry-cut: short filtered air whoosh
 * - throat-vibrate: warm low vocal-cord hum
 */
export function playKinestheticCue(motionType: MotionType, beatIndex: 0 | 1 | 2): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (motionType === 'vocal-ladder') {
    const freqs = [587.33, 440, 329.63]; // D5 -> A4 -> E4 descending
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freqs[beatIndex], now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
    return;
  }

  if (motionType === 'step-twin-clap' && beatIndex > 0) {
    // Crisp handclap noise burst
    const bufferSize = ctx.sampleRate * 0.11;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.025));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(1.2, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    return;
  }

  if (motionType === 'wind-push' || (motionType === 'throat-dry-cut' && beatIndex > 0)) {
    const bufferSize = ctx.sampleRate * 0.14;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(motionType === 'throat-dry-cut' ? 2800 : 900, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.14);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    return;
  }

  if (motionType === 'throat-vibrate' && beatIndex > 0) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(135, now);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(360, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.21);
    return;
  }

  if (motionType === 'syllable-bounce' && beatIndex > 0) {
    // Double bounce tap for -ed (/ɪd/)
    [0, 0.11].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(offset === 0 ? 320 : 460, now + offset);
      osc.frequency.exponentialRampToValueAtTime(140, now + offset + 0.08);
      gain.gain.setValueAtTime(0.22, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.09);
    });
    return;
  }

  // Default tactile wood/table tap (heavier on beat 2 for three-step-heel)
  const isHeelBeat = motionType === 'three-step-heel' && beatIndex === 2;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(isHeelBeat ? 145 : 220, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + (isHeelBeat ? 0.16 : 0.09));
  gain.gain.setValueAtTime(isHeelBeat ? 0.36 : 0.24, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + (isHeelBeat ? 0.17 : 0.1));
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + (isHeelBeat ? 0.18 : 0.11));
}

export function cleanSpeakText(raw: string, override?: string): string {
  if (override) return override;
  return raw
    .replace(/\(.*?\)/g, '')
    .split('/')[0]
    .trim();
}

export function speakEnglishWord(text: string, rate = 0.95): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setTimeout(resolve, 420);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      const enVoice =
        voices.find((v) => v.lang.startsWith('en-US') && !v.localService) ||
        voices.find((v) => v.lang.startsWith('en-US')) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;

      let settled = false;
      const finish = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      // Fallback timer in case browser speechSynthesis stalls
      setTimeout(finish, Math.max(700, 1400 / rate));
      window.speechSynthesis.speak(utterance);
    } catch {
      setTimeout(resolve, 420);
    }
  });
}

export function getBeatSpeakTexts(verb: VerbItem): [string, string, string] {
  return [
    cleanSpeakText(verb.present, verb.speakPresent),
    cleanSpeakText(verb.past, verb.speakPast),
    cleanSpeakText(verb.participle, verb.speakParticiple),
  ];
}
