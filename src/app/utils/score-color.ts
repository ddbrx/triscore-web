export function GetScoreColor(score: number): string {
  if (score >= 3000) {
    return '#db4c3f';
  } else if (score >= 2500) {
    return '#ff8c00';
  } else if (score >= 2000) {
    return '#f5ba26';
  } else if (score >= 1800) {
    return '#8a2be2';
  } else if (score >= 1700) {
    return '#0000ff';
  } else if (score >= 1600) {
    return '#87ceeb';
  } else if (score >= 1400) {
    return '#008b8b';
  } else if (score >= 1200) {
    return '#008000';
  }
  return '#a09d9d';
}

export function GetScoreLevel(score: number) {
//   Newbie
// Novice
// Rookie
// Beginner
// Talented
// Skilled
// Intermediate
// Skillful
// Seasoned
// Proficient
// Experienced
// Advanced
// Senior
// Expert

  if (score >= 3000) {
    return 'Legend';
  } else if (score >= 2500) {
    return 'Master';
  } else if (score >= 2000) {
    return 'Senior';
  } else if (score >= 1800) {
    return 'Experienced';
  } else if (score >= 1700) {
    return 'Skilled';
  } else if (score >= 1600) {
    return 'Rookie';
  } else if (score >= 1400) {
    return 'Newbie';
  } else if (score >= 1200) {
    return 'Unstoppable';
  }
  return '';
}

export function GetFirstLetterColor(score: number): string {
  if (score >= 3000) {
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
