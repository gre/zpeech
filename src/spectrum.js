/*
 * This file is part of Zpeech.
 *
 * Copyright 2014 Zengularity
 *
 * Zpeech is free software: you can redistribute it and/or modify
 * it under the terms of the AFFERO GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Zpeech is distributed "AS-IS" AND WITHOUT ANY WARRANTY OF ANY KIND,
 * INCLUDING ANY IMPLIED WARRANTY OF MERCHANTABILITY,
 * NON-INFRINGEMENT, OR FITNESS FOR A PARTICULAR PURPOSE. See
 * the AFFERO GNU General Public License for the complete license terms.
 *
 * You should have received a copy of the AFFERO GNU General Public License
 * along with Zpeech.  If not, see <http://www.gnu.org/licenses/agpl-3.0.html>
 */

function Spectrum (ctx, array) {
  this.ctx = ctx;
  this.array = array;
  this.bg = "#fff";
  this.color = "#00B5AD";
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
  var w = freqw-freqborder;
  ctx.fillStyle = this.color;
  for (var i=0; i<lengthSpectrum; ++i) {
    var value = arraySpectrum[i];
    var x = Math.floor(i*freqw);
    ctx.fillRect(x,H-(H*value/256),w,H);
  }

  ctx.fillStyle = "#D95C5C";
  formants.forEach(function (f) {
    ctx.fillRect(f * freqw, 0, 1, H);
  });
}

module.exports = Spectrum;
