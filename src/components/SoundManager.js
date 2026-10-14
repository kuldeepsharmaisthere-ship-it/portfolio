export class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.isEnabled = false;

    // Check local storage for preference
    const saved = localStorage.getItem('synthwave_sfx_enabled');
    if (saved === 'true') {
      this.isEnabled = true;
    }

    this.initUI();
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('synthwave_sfx_enabled', this.isEnabled ? 'true' : 'false');
    if (this.isEnabled) {
      this.initAudioContext();
      this.playBlip(650, 'sine', 0.15);
    }
    this.updateUI();
    return this.isEnabled;
  }

  initUI() {
    const toggleBtn = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    const soundText = document.getElementById('soundText');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggle();
      });
    }
    this.updateUI();
  }

  updateUI() {
    const toggleBtn = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    const soundText = document.getElementById('soundText');

    if (toggleBtn && soundIcon && soundText) {
      if (this.isEnabled) {
        toggleBtn.classList.add('active');
        soundIcon.textContent = '🔊';
        soundText.textContent = 'SFX ON';
      } else {
        toggleBtn.classList.remove('active');
        soundIcon.textContent = '🔇';
        soundText.textContent = 'SFX OFF';
      }
    }
  }

  playClick() {
    if (!this.isEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  playBlip(freq = 520, type = 'sine', duration = 0.1) {
    if (!this.isEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playTick() {
    if (!this.isEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(900, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.02);
  }

  playLaser() {
    if (!this.isEnabled) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(990, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, this.audioCtx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.18);
  }
}
