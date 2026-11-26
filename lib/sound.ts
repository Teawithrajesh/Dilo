// A soft two-note chime made in the browser (Web Audio). No sound file needed.
let ctx: AudioContext | null = null;

export function playChime() {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.value = 0.9;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 3200;
    filter.connect(out).connect(ctx.destination);

    // Two gentle sine notes (E5 then B5), each with a soft attack and a smooth fade.
    [
      { f: 659.25, t: 0, peak: 0.16 },
      { f: 987.77, t: 0.07, peak: 0.12 },
    ].forEach(({ f, t, peak }) => {
      const osc = ctx!.createOscillator();
      const g = ctx!.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      g.gain.setValueAtTime(0, now + t);
      g.gain.linearRampToValueAtTime(peak, now + t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.55);
      osc.connect(g).connect(filter);
      osc.start(now + t);
      osc.stop(now + t + 0.6);
    });
  } catch {
    /* sound is a nice-to-have */
  }
}
