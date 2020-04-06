import { data as countryEmojies } from 'emoji-flags';
import { data as countryCodes } from './country-codes.json';

export function GetCountryNames(): string[] {
  return countryCodes.map(country => country.name).sort();
}

export function IsValidCountryName(word: string): boolean {
  return word.trim().length == 0 || countryCodes.some(country => country.name == word);
}

export function GetCountryFifaCodeByName(countryName: string): string {
  if (!countryName || countryName.trim().length == 0) {
    return '';
  }

  var country = countryCodes.find(c => c.name == countryName);
  if (!country) {
    console.error('country not found: ' + countryName);
    return '';
  }
  return country.fifa;
}

export function GetCountryFlag(countryFifaCode: string): string {
  var country = countryCodes.find(c => c['fifa'] == countryFifaCode);
  if (!country) {
    console.error('no country found fifa code: ' + countryFifaCode);
    return countryFifaCode;
  }

  var countryAlphaTwoCode = country.a2;
  var countryEmoji = countryEmojies.find(c => c.code == countryAlphaTwoCode);
  if (!countryEmoji) {
    return countryFifaCode;
  }

  return countryEmoji.emoji;
}