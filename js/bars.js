class Bar {
  constructor(r, theta, h, noise) {
    this._r = r;
    this._theta = theta + Math.PI / 2;
    this._h = h;
    this._noise = noise;
    // unique seed for each bar
    this._seed = Math.sin(theta / 4) * 50;
    // bar width
    this._w = 7.5;
    // noise octaves
    this._noise_depth = 2;
    // color aberration palette
    this._palette = ["#FF00FF", "#00FFFF", "#FFFFFF"];
    // color aberration position
    this._d_pos = [-1, 1, 0];
  }

  show(ctx, nx, ny) {
    const ease = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

    const dec_to_hex = (dec) => {
      dec = Math.floor(dec);
      return dec.toString(16).padStart(2, 0).toUpperCase();
    };

    const map = (value, old_min, old_max, new_min, new_max) => {
      return (
        ((value - old_min) * (new_max - new_min)) / (old_max - old_min) +
        new_min
      );
    };

    const n = this._generateNoise(nx, ny, this._seed);
    const h = Math.floor(this._h * ease(n));
    const alpha = dec_to_hex(map(n, 0, 1, 255, 50));

    ctx.save();
    ctx.rotate(this._theta);
    ctx.translate(this._r, 0);

    ctx.globalCompositeOperation = "screen";

    this._palette.forEach((c, i) => {
      ctx.save();
      ctx.fillStyle = c + alpha;
      ctx.translate(this._d_pos[i], -this._d_pos[i]);
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
      n += ((this._noise.noise4D(x * f, y * f, z * f, w * f) + 1) / 2) * a;
    }
    return n / a_sum;
  }
}
