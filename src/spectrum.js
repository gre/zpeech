
function Spectrum (ctx, array) {
  this.ctx = ctx;
  this.array = array;
  this.bg = "#999";
  this.color = "#000";
}

Spectrum.prototype.render = function (formants) {
  var ctx = this.ctx;
  var arraySpectrum = this.array;
  var lengthSpectrum = arraySpectrum.length;

  var W = ctx.canvas.width;
  var H = ctx.canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = this.bg;
  ctx.fillRect(0,0,W,H);

  var freqw = Math.round(W / lengthSpectrum); // We can afford to lose some high freq viz...
  var freqborder = Math.floor(freqw / 5);
  for (var i=0; i<lengthSpectrum; ++i) {
    var value = arraySpectrum[i];
    var x = i*freqw;
    var w = freqw-freqborder;
    ctx.fillStyle = this.color;
    ctx.fillRect(x,H-(H*value/256),w,H);
  }

  ctx.fillStyle = "#f00";
  formants.forEach(function (f) {
    console.log(f);
    ctx.fillRect(f * freqw, 0, 1, H);
  });
}

module.exports = Spectrum;
