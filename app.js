
var AudioContext = require("audiocontext");
var _ = require("lodash");
var formantsToVowel = require("./src/formantsToVowel");
var extractFormants = require("./src/extractFormants");
var getMicrophone = require("./src/getMicrophone");
var Spectrum = require("./src/spectrum");

if (!AudioContext) {
  alert("no AudioContext support available in your browser.");
  throw new Error("AudioContext not supported");
}

var ctx = new AudioContext();
var analyzer = ctx.createAnalyser();
var maybeMicrophone = getMicrophone(ctx).then(function (mic) {
  mic.connect(analyzer);
  return mic;
});

var SAMPLES = 1024;

var array = new Uint8Array(SAMPLES);
analyzer.smoothingTimeConstant = 0.6;
analyzer.fftSize = SAMPLES * 2;

function indexToFrequency (i) {
  return i * ctx.sampleRate / analyzer.fftSize;
}
function valueToPercent (value) {
  return value / 256;;
}

var formants = [];
var $vowel = document.getElementById("vowel");
maybeMicrophone.then(function(mic){
  setInterval(function(){
    analyzer.getByteFrequencyData(array);
    formants = extractFormants(array, indexToFrequency, valueToPercent);
    var vowel = formantsToVowel.apply(this, formants);
    if (vowel) {
      $vowel.innerHTML = vowel;
      $vowel.className = "";
    }
    else {
      $vowel.className = "hidden";
    }
  }, 100);
});

(function(canvas) {
  var canvasCtx = canvas.getContext("2d");
  var spectrum = new Spectrum(canvasCtx, array);
  function loop () {
    requestAnimationFrame(function () {
      loop();
      spectrum.render(_.map(formants, function (f) {
        return Math.floor(f.freq * analyzer.fftSize / ctx.sampleRate);
      }));
    });
  }
  maybeMicrophone.then(loop);
}(document.getElementById("frequencies")));
