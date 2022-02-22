class Sketch extends Engine {
  preload() {
    this._recording = true;
    this._duration = 600;
    this._bars_num = 40;
    this._noise_r = 1.1;
    this._circle_r = this.width / 8;
    this._h = this.width / 2 - this._circle_r;
  }

  setup() {
    // setup noise
    this._noise = new SimplexNoise();
    // setup capturer
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
      this._capturer.start();
    }
    // create bars
    this._bars = [];
    for (let i = 0; i < this._bars_num; i++) {
      // bar angle
      const theta = (i / this._bars_num) * Math.PI * 2;
      this._bars.push(new Bar(this._circle_r, theta, this._h, this._noise));
    }
  }

  draw() {
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
      if (this.frameCount < this._duration) {
        this._capturer.capture(this._canvas);
      } else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
      }
    }
  }
}
