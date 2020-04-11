export function GetScoreColor(score: number): string {
  if (score >= 3000) {
    return '#db4c3f';
  } else if (score >= 2700) {
    return '#ff8c00';
  } else if (score >= 2450) {
    return '#a07509';
  } else if (score >= 2300) {
    return '#f5ba26';
  } else if (score >= 2150) {
    return '#df06df';
  } else if (score >= 2000) {
    return '#841de4';
  } else if (score >= 1900) {
    return '#b070eb';
  } else if (score >= 1800) {
    return '#0000ff';
  } else if (score >= 1700) {
    return '#007fff';
  } else if (score >= 1600) {
    return '#70c8eb';
  } else if (score >= 1550) {
    return '#008b8b';
  } else if (score >= 1500) {
    return '#23ce78';
  } else if (score >= 1450) {
    return '#008000';
  } else if (score >= 1400) {
    return '#bdb76b';
  }
  return '#757474';
}

export function GetScoreLevel(score: number) {
  if (score >= 3300) {
    return 'Wolfram';
  } else if (score >= 3000) {
    return 'Tantalum';
  } else if (score >= 2700) {
    return 'Molybdenum';
  } else if (score >= 2450) {
    return 'Iridium';
  } else if (score >= 2300) {
    return 'Ruthenium';
  } else if (score >= 2150) {
    return 'Technetium';
  } else if (score >= 2000) {
    return 'Rhodium';
  } else if (score >= 1900) {
    return 'Chromium';
  } else if (score >= 1800) {
    return 'Zirconium';
  } else if (score >= 1700) {
    return 'Titanium';
  } else if (score >= 1600) {
    return 'Palladium';
  } else if (score >= 1550) {
    return 'Ferrum';
  } else if (score >= 1500) {
    return 'Cobalt';
  } else if (score >= 1450) {
    return 'Nickel';
  } else if (score >= 1400) {
    return 'Silicon';
  }
  return 'Cuprum';
}


export function GetScoreLevelShort(score: number) {
  if (score >= 3300) {
    return 'W';
  } else if (score >= 3000) {
    return 'Ta';
  } else if (score >= 2700) {
    return 'Mo';
  } else if (score >= 2450) {
    return 'Ir';
  } else if (score >= 2300) {
    return 'Ru';
  } else if (score >= 2150) {
    return 'Tc';
  } else if (score >= 2000) {
    return 'Rh';
  } else if (score >= 1900) {
    return 'Cr';
  } else if (score >= 1800) {
    return 'Zr';
  } else if (score >= 1700) {
    return 'Ti';
  } else if (score >= 1600) {
    return 'Pd';
  } else if (score >= 1550) {
    return 'Fe';
  } else if (score >= 1500) {
    return 'Co';
  } else if (score >= 1450) {
    return 'Ni';
  } else if (score >= 1400) {
    return 'Si';
  }
  return 'Cu';
}

export function GetFirstLetterColor(score: number): string {
  if (score >= 3300) {
    return '#000000';
  }
  return GetScoreColor(score);
}

export function GetScoreStyle(score: number) {
  var color = GetScoreColor(score);
  return GetStyleByColor(color);
}

export function GetFirstLetterStyle(score: number) {
  var color = GetFirstLetterColor(score);
  return GetStyleByColor(color);
}

export function GetStyleByColor(color: string) {
  return {
    'color': color
  }
}
