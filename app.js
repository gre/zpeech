
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

setInterval(function(){
  analyzer.getByteFrequencyData(array);
  console.log(formantsToVowel.apply(this, extractFormants(array)));
}, 1000);

