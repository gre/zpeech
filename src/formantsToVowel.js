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
function formantsToVowel (f1, f2, f3) {
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
  }
  return null;
}

module.exports = formantsToVowel;
