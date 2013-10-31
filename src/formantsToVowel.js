function formantsToVowel (f1, f2, f3) {
  if (f1.freq < 200) return null;
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
