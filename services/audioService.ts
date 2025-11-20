// A simple service to generate synthetic sounds without external assets
class AudioService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  // Simulates a wooden rattle sound (like shaking sticks)
  public playShakeSound() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();

    const duration = 0.1;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Noise-ish sound using random modulation
    osc.type = 'sawtooth';
    osc.frequency.value = 50; // Low rumble base
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(100, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  // Simulates a clear "Ding" or "Clack" when a stick falls
  public playDrawSound() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }

  // Mystical ambient chime for result
  public playRevealSound() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major chord
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = ctx.currentTime + (i * 0.1);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 2.5);
    });
  }
}

export const audioService = new AudioService();
