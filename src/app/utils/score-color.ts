export function GetScoreColor(score: number): string {
  if (score >= 3000) {
    return '#db4c3f';
  } else if (score >= 2700) {
    return '#ff8c00';
  } else if (score >= 2500) {
    return '#a07509';
  } else if (score >= 2300) {
    return '#f5ba26';
  } else if (score >= 2100) {
    return '#df06df';
  } else if (score >= 1900) {
    return '#8a2be2';
  } else if (score >= 1800) {
    return '#0000ff';
  } else if (score >= 1700) {
    return '#007fff';
  } else if (score >= 1600) {
    return '#87ceeb';
  } else if (score >= 1550) {
    return '#008b8b';
  } else if (score >= 1500) {
    return '#06e073';
  } else if (score >= 1450) {
    return '#008000';
  } else if (score >= 1400) {
    return '#bdb76b';
  } else if (score >= 1300) {
    return '#757474';
  }
  return '#b4b0b0';
}

export function GetScoreLevel(score: number) {
  if (score >= 3300) {
    return 'Wolfram';
  } else if (score >= 3000) {
    return 'Osmium';
  } else if (score >= 2700) {
    return 'Molybdenum';
  } else if (score >= 2500) {
    return 'Iridium';
  } else if (score >= 2300) {
    return 'Ruthenium';
  } else if (score >= 2100) {
    return 'Technetium';
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
  } else if (score >= 1300) {
    return 'Beryllium';
  }
  return 'Copper';
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
