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

var Q = require("q");

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


function getMicrophone (ctx, increaseGain) {
  var userAudio = (function (d) {
    navigator.getUserMedia({ audio: true }, d.resolve, d.reject);
    return d.promise;
  }(Q.defer()));

  var microphone = userAudio.then(function (stream) {
    var mic = ctx.createMediaStreamSource(stream);
    var gain = ctx.createGain();
    gain.gain.value = increaseGain||1;
    var compr = ctx.createDynamicsCompressor();
    mic.connect(gain);
    gain.connect(compr);
    return compr;
  });

  return microphone;
}

module.exports = getMicrophone;
