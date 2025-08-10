let primed = false;

export async function primeAudio(): Promise<boolean> {
  if (primed) return true;
  try {
    // Strategy 1: use Web Audio API (recommended on Chrome)
    // const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    // if (ctx.state === "suspended") await ctx.resume();

    // Strategy 2: tiny HTMLAudioElement play/stop to unlock audio
    const a = new Audio();
    a.src = "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA"; // ultra-short silent data URI
    a.muted = false;
    await a.play(); // requires user gesture
    a.pause();
    primed = true;
    return true;
  } catch {
    return false;
  }
}

export function isAudioPrimed() {
  return primed;
}
