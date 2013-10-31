
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
