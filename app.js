var SAMPLES = 1024;
var REFRESH_RATE = 50;

var AudioContext = require("audiocontext");
var _ = require("lodash");
var dat = require("dat-gui");
var Qajax = require("qajax");
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

var greFormants = {
  i: [100, 3379],
  e: [430, 2336],
  u: [200, 1500],
  a: [827, 1542],
  o: [562, 3577],
  œ: [695, 1840]
};

var formantsParams = greFormants;

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

var sendLetter = 
  _.throttle(function(l){
    return Qajax("http://10.0.25.2:9000/letter?q="+l);
  }, 100);

maybeMicrophone.then(function(mic){
  setInterval(function(){
    analyzer.getByteFrequencyData(array);
    formants = extractFormants(array, indexToFrequency, valueToPercent);
    $f1.textContent = "~"+Math.round(formants[0].freq);
    $f2.textContent = "~"+Math.round(formants[1].freq);
    var vowels = formantsToVowels(formants, f1Params, f2Params);
    if (vowels[0]) sendLetter(vowels[0][0]);
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

var folder;
folder = gui.addFolder('f1');
_.each(f1Params, function (f, v) {
  folder.add(f1Params, v, 0, 3000);
});

folder = gui.addFolder('f2');
_.each(f2Params, function (f, v) {
  folder.add(f2Params, v, 500, 5000);
});
