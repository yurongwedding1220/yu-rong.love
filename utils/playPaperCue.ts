/** Short rustle + haptic after the same gesture that starts the invitation music. */
export const playPaperCue = () => {
  try {
    navigator.vibrate?.(14);
  } catch {
    /* ignore */
  }

  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const duration = 0.14;
    const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * duration)), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      const t = i / data.length;
      const envelope = Math.pow(1 - t, 2.1) * (t < 0.08 ? t / 0.08 : 1);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.22;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2100;
    filter.Q.value = 0.85;

    const gain = ctx.createGain();
    gain.gain.value = 0.16;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.onended = () => {
      void ctx.close();
    };
  } catch {
    /* ignore */
  }
};
