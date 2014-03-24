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
var _ = require("lodash");

function log () {
  if (Math.random()<0.001)
  console.log.apply(console, arguments);
}

function formantsToVowels (formants, f1Params, f2Params) {
  var formantsFreq = _.pluck(formants, "freq");

  if (formants[0].db<0.7 && formants[1].db<0.6) return [];

  var params = {};
  _.each(f1Params, function (f1, v) {
    params[v] = [ f1Params[v], f2Params[v] ];
  });
  var distances = _.map(params, function (f, vowel) {
    var formantDistance = _(f).zip(formantsFreq)
     .map(function (tuple) {
       var d = tuple[0]-tuple[1];
       return d * d;
     })
     .reduce(function (sum, num) {
       return sum + num;
     }, 0);
     return [ vowel, formantDistance ];
  });

  var max = _.max(_.pluck(distances, 1));
  var probabilities = _(distances)
    .sort(function (a, b) {
      return a[1] - b[1];
    })
    .map(function (tuple) {
      var d = tuple[1]/max;
      return [tuple[0], 1-d];
    })
    .value();

  return _(probabilities)
    .filter(function (p) {
      return p[1] > 0.9;
    })
    .take(3)
    .value();

  /*
  if (f1.freq < 200) return null;
  if (f1.db < 0.6 && f2.db < 0.6) return null;

  if (f2.db > 0.5*f1.db) {
    if (f1.freq > 200 && f1.freq < 400 && 
        f2.freq > 3000 && f2.freq < 3500) {
          return "i";
    }
    if (f1.freq > 400 && f1.freq < 600 && 
        f2.freq > 2200 && f2.freq < 2600) {
          return "e";
    }
  }
  else {
    if (f1.freq > 200 && f1.freq < 400) {
      return "u";
    }
    if (f1.freq > 400 && f1.freq < 600) {
      return "o";
    }
    if (f1.freq > 800 && f1.freq < 1200) {
      return "a";
    }
  }*/
  return null;
}

module.exports = formantsToVowels;
