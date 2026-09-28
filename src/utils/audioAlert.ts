// Bulletproof Dual-Engine Audio & Desktop Notification System
// 1. Web Audio API synthesized rich 2-tone melodic chime ("딩~동! 🔔")
// 2. High-fidelity HTML5 Audio fallback via dynamic in-memory 16-bit PCM WAV
// 3. Browser Autoplay unlocker on first user gesture
// 4. Web Notification API for background / minimized tab alerts

let audioCtx: AudioContext | null = null;
let isAudioEnabled = true;
let isUnlocked = false;
let cachedWavDataUri: string | null = null;
let fallbackAudioEl: HTMLAudioElement | null = null;

// Generate pure 16-bit PCM WAV bell chime in memory ("딩-동! 🔔")
function getWavChimeDataUri(): string {
  if (cachedWavDataUri) return cachedWavDataUri;
  try {
    const sampleRate = 22050;
    const duration = 1.0;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new Int16Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      // Tone 1: High Bell (E5: 659.25Hz) with decay
      if (t < 0.6) {
        const env1 = Math.exp(-t * 6.5);
        sample += 0.5 * Math.sin(2 * Math.PI * 659.25 * t) * env1;
        sample += 0.2 * Math.sin(2 * Math.PI * 1318.5 * t) * env1;
      }
      // Tone 2: Warm Bell (C5: 523.25Hz) with decay
      if (t >= 0.22) {
        const t2 = t - 0.22;
        const env2 = Math.exp(-t2 * 5.0);
        sample += 0.6 * Math.sin(2 * Math.PI * 523.25 * t2) * env2;
        sample += 0.22 * Math.sin(2 * Math.PI * 1046.5 * t2) * env2;
      }
      buffer[i] = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    }

    // Standard 44-byte WAV header
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    function writeStr(offset: number, s: string) {
      for (let j = 0; j < s.length; j++) view.setUint8(offset + j, s.charCodeAt(j));
    }
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    const wavBytes = new Uint8Array(44 + numSamples * 2);
    wavBytes.set(new Uint8Array(header), 0);
    wavBytes.set(new Uint8Array(buffer.buffer), 44);

    let binary = '';
    const len = wavBytes.byteLength;
    for (let k = 0; k < len; k++) {
      binary += String.fromCharCode(wavBytes[k]);
    }
    const base64 = btoa(binary);
    cachedWavDataUri = `data:audio/wav;base64,${base64}`;
    return cachedWavDataUri;
  } catch (err) {
    console.warn('WAV chime generation error:', err);
    return '';
  }
}

// User-gesture unlocker to satisfy browser Autoplay policies
export function unlockAudio() {
  if (isUnlocked) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
    }
    // Pre-prime HTML5 audio element
    if (!fallbackAudioEl && typeof Audio !== 'undefined') {
      const uri = getWavChimeDataUri();
      if (uri) {
        fallbackAudioEl = new Audio(uri);
        fallbackAudioEl.volume = 0.85;
      }
    }
    isUnlocked = true;
  } catch {
    // Ignore
  }
}

// Auto-register unlock on first user gesture
if (typeof window !== 'undefined') {
  const onFirstGesture = () => {
    unlockAudio();
    window.removeEventListener('click', onFirstGesture);
    window.removeEventListener('touchstart', onFirstGesture);
    window.removeEventListener('keydown', onFirstGesture);
  };
  window.addEventListener('click', onFirstGesture, { passive: true });
  window.addEventListener('touchstart', onFirstGesture, { passive: true });
  window.addEventListener('keydown', onFirstGesture, { passive: true });
}

export function setAudioAlarmEnabled(enabled: boolean) {
  isAudioEnabled = enabled;
  try {
    localStorage.setItem('re_audio_alarm_enabled', enabled ? 'true' : 'false');
  } catch {}
}

export function getAudioAlarmEnabled(): boolean {
  try {
    const val = localStorage.getItem('re_audio_alarm_enabled');
    if (val !== null) return val === 'true';
  } catch {}
  return isAudioEnabled;
}

// Play the rich chime sound using Web Audio + HTML5 Audio fallback
export function playInquiryChime() {
  if (!getAudioAlarmEnabled()) return;

  unlockAudio();
  let webAudioSucceeded = false;

  // 1. Try Web Audio API
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      if (audioCtx.state === 'running' || audioCtx.state === 'suspended') {
        const now = audioCtx.currentTime;

        // Tone 1: High bell chime (E5: ~659.25Hz)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now);

        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.5, now + 0.04);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.7);

        // Tone 2: Warm deep bell chime (C5: ~523.25Hz)
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(523.25, now + 0.22);

        gain2.gain.setValueAtTime(0, now + 0.22);
        gain2.gain.linearRampToValueAtTime(0.55, now + 0.26);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + 0.22);
        osc2.stop(now + 1.3);

        webAudioSucceeded = true;
      }
    }
  } catch (err) {
    console.warn('Web Audio chime playback error:', err);
  }

  // 2. HTML5 Audio fallback (or backup if Web Audio was suspended)
  try {
    const uri = getWavChimeDataUri();
    if (uri) {
      const audio = new Audio(uri);
      audio.volume = 0.9;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          // If autoplay prevented, fallback to primed audio
          if (fallbackAudioEl) {
            fallbackAudioEl.currentTime = 0;
            fallbackAudioEl.play().catch(() => {});
          }
        });
      }
    }
  } catch (err) {
    console.warn('HTML5 Audio fallback error:', err);
  }
}

// Request Desktop Web Notification Permission
export async function requestDesktopNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  try {
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    }
  } catch {}
  return false;
}

// Trigger Desktop notification for background / minimized tabs
export function showDesktopNotification(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  try {
    if (Notification.permission === 'granted') {
      const notif = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 're-inquiry-alarm'
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    }
  } catch {}
}
