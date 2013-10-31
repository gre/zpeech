var _ = require("lodash");

function extractFormants (frequenciesBuffer, indexToFrequency, valueToPercent) {
  var size = frequenciesBuffer.length;
  var f1, f2;
  var maxf1 = -Infinity, maxf2 = -Infinity;
  _.each(frequenciesBuffer, function (value, i) {
    var freq = indexToFrequency(i);
    var db = valueToPercent(value);
    if (freq < 1200) {
      if (db > maxf1) {
        maxf1 = db;
        f1 = freq;
      }
    }
    else if (freq < 5000) {
      if (db > maxf2) {
        maxf2 = db;
        f2 = freq;
      }
    }
  });
  return [{
    db: maxf1,
    freq: f1
  }, {
    db: maxf2,
    freq: f2
  }];
}

module.exports = extractFormants;
