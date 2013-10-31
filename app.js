
var AudioContext = require("audiocontext");
var formantsToVowel = require("./src/formantsToVowel");
var extractFormants = require("./src/extractFormants");
var getMicrophone = require("./src/getMicrophone");

if (!AudioContext) {
  alert("no AudioContext support available in your browser.");
  throw new Error("AudioContext not supported");
}

var ctx = new AudioContext();
var analyzer = ctx.createAnalyser();
var maybeMicrophone = getMicrophone(ctx, 1.0).then(function (mic) {
  mic.connect(analyzer);
  return mic;
});

var SAMPLES = 1024;

var array = new Uint8Array(SAMPLES);
analyzer.smoothingTimeConstant = 0.1;
analyzer.fftSize = SAMPLES * 2;

function indexToFrequency (i) {
  return i * ctx.sampleRate / analyzer.fftSize;
}
function valueToPercent (value) {
  return value / 256;;
}

var $vowel = document.getElementById("vowel");
maybeMicrophone.then(function(mic){
  setInterval(function(){
    analyzer.getByteFrequencyData(array);
    var formants = extractFormants(array, indexToFrequency, valueToPercent);
    var vowel = formantsToVowel.apply(this, formants);
    if (vowel) {
      $vowel.innerHTML = vowel;
    }
    else {
      $vowel.innerHTML = "";
    }
  }, 100);
});
