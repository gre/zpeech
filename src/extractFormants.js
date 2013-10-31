var _ = require("lodash");

function extractFormants (frequenciesBuffer, indexToFrequency, valueToPercent) {
  var size = frequenciesBuffer.length;
  var f1, f2;
  var maxf1 = -Infinity, maxf2 = -Infinity;
  var period = 16;
  var sma = simple_moving_averager(period);

  _.each(frequenciesBuffer, function (value, i) {
    var freq = indexToFrequency(i);
    var db = valueToPercent(sma(value));
    if (freq < 1500) {
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

function simple_moving_averager(period) {
    var nums = [];
    return function(num) {
        nums.push(num);
        if (nums.length > period)
            nums.splice(0,1);  // remove the first element of the array
        var sum = 0;
        for (var i in nums)
            sum += nums[i];
        var n = period;
        if (nums.length < period)
            n = nums.length;
        return(sum/n);
    }
}

module.exports = extractFormants;
