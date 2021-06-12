class Sketch extends Engine {
  preload() {
    this._bars_num = 40;
    this._noise_r = 1.5;
    this._circle_r = this.width / 8;
    this._h = (this.width / 2 - this._circle_r) * 0.9;
    this._duration = 600;
    this._recording = false;
  }

  setup() {
    // setup capturer
    this._capturer_started = false;
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
    }
    // setup noise
    this._noise = new SimplexNoise();
    // create bars
    this._bars = [];
    for (let i = 0; i < this._bars_num; i++) {
      const theta = (i / this._bars_num) * Math.PI * 2;
      this._bars.push(new Bar(this._circle_r, theta, this._h, this._noise));
    }
  }

  draw() {
    // start capturer
    if (!this._capturer_started && this._recording) {
      this._capturer_started = true;
      this._capturer.start();
      console.log("%c Recording started", "color: green; font-size: 2rem");
    }

    // noise time positions
    const percent = (this.frameCount % this._duration) / this._duration;
    const nx = this._noise_r * (1 + Math.cos(percent * Math.PI * 2));
    const ny = this._noise_r * (1 + Math.sin(percent * Math.PI * 2));

    // background reset
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "rgb(15, 15, 15)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // draw bars
    this.ctx.save();
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.globalCompositeOperation = "screen";
    this._bars.forEach((b) => b.show(this.ctx, nx, ny));
    this.ctx.restore();

    // handle recording
    if (this._recording) {
      if (this.frameCount % 60 == 0) {
        const update = `Record: ${parseInt(percent * 100)}%`;
        console.log(`%c ${update}`, "color: yellow; font-size: 0.75rem");
      }
      if (this.frameCount < this._duration) {
        this._capturer.capture(this._canvas);
      } else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
        console.log("%c Recording ended", "color: red; font-size: 2rem");
      }
    }
  }
}