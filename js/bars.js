class Bar {
  constructor(r, theta, h, noise) {
    this._r = r;
    this._theta = theta + Math.PI / 2;
    this._h = h;
    this._noise = noise;

    this._seed = Math.random() * 1000;
    this._w = 7.5;
    this._noise_depth = 3;
    this._palette = ["#FF00FF", "#00FFFF", "#FFFFFF"];
    this._dpos = [-1, 1, 0];
  }

  show(ctx, nx, ny) {
    const n = this._generateNoise(nx, ny, this._seed);
    const h = Math.floor(this._h * n);

    ctx.save();
    ctx.rotate(this._theta);
    ctx.translate(this._r, 0);


    this._palette.forEach((c, i) => {
      ctx.save();
      ctx.fillStyle = c;
      ctx.translate(this._dpos[i], -this._dpos[i]);
      ctx.fillRect(-this._w / 2, 0, h, this._w);
      ctx.restore();
    });

    ctx.restore();
  }

  _generateNoise(x = 0, y = 0, z = 0, w = 0) {
    let n = 0;
    let a_sum = 0;
    for (let i = 0; i < this._noise_depth; i++) {
      const f = Math.pow(2, i);
      const a = Math.pow(2, -i);
      a_sum += a;
      n += (this._noise.noise4D(x * f, y * f, z * f, w * f) + 1) / 2 * a;
    }
    return n / a_sum;
  }
}