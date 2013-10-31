var SAMPLES = 1024;
var REFRESH_RATE = 50;

var AudioContext = require("audiocontext");
var _ = require("lodash");
var dat = require("dat-gui");
var formantsToVowels = require("./src/formantsToVowels");
var extractFormants = require("./src/extractFormants");
var getMicrophone = require("./src/getMicrophone");
var Spectrum = require("./src/spectrum");

if (!AudioContext) {
  alert("no AudioContext support available in your browser.");
  throw new Error("AudioContext not supported");
}

var ctx = new AudioContext();
var analyzer = ctx.createAnalyser();
var maybeMicrophone = getMicrophone(ctx, 1.5).then(function (mic) {
  mic.connect(analyzer);
  return mic;
});


var array = new Uint8Array(SAMPLES);
analyzer.smoothingTimeConstant = 0.7;
analyzer.fftSize = SAMPLES * 2;

function indexToFrequency (i) {
  return i * ctx.sampleRate / analyzer.fftSize;
}
function valueToPercent (value) {
  return value / 256;;
}

var formantsParams = {
  i: [250, 2250],
  //e: [420, 2050],
  //ɛ: [590, 1770],
  u: [290, 750],
  a: [760, 1450],
  o: [360, 770],
  //ɔ: [520, 1070],
  //y: [250, 1750],
  //ø: [350, 1350],
  œ: [500, 1330],
  //ə: [570, 1560]
};

var f1Params = {};
var f2Params = {};
_.each(formantsParams, function (f, v) {
  f1Params[v] = f[0];
  f2Params[v] = f[1];
});

var formants = [];
var $vowel_container = document.getElementById("vowel");
var $vowels = _.map(_.range(0, 3), function (i) {
  var node = document.createElement("span");
  node.className = "vowel";
  $vowel_container.appendChild(node);
  return node;
});

var $f1 = document.getElementById("f1");
var $f2 = document.getElementById("f2");

maybeMicrophone.then(function(mic){
  setInterval(function(){
    analyzer.getByteFrequencyData(array);
    formants = extractFormants(array, indexToFrequency, valueToPercent);
    $f1.textContent = Math.round(formants[0].freq);
    $f2.textContent = Math.round(formants[1].freq);
    var vowels = formantsToVowels(formants, f1Params, f2Params);
    _.each($vowels, function ($vowel, i) {
      var vowel = vowels[i];
      if (vowel) {
        $vowel.textContent = vowel[0];
        $vowel.classList.remove("hidden");
      }
      else {
        $vowel.classList.add("hidden");
      }
    });
  }, REFRESH_RATE);
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


var gui = new dat.GUI();

_.each(f1Params, function (f, v) {
  gui.add(f1Params, v, 0, 4000);
  gui.add(f2Params, v, 0, 4000);
});
