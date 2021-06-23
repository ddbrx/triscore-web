import { data as countryCodes } from './country-codes.json';

export function GetCountryNames(): string[] {
  return countryCodes.map(country => country.name).sort();
}

export function IsValidCountryName(word: string): boolean {
  return word.trim().length == 0 || countryCodes.some(country => country.name == word);
}

export function GetCountryFifaCodeByName(countryName: string): number {
  if (!countryName || countryName.trim().length == 0) {
    return 0;
  }

  var country = countryCodes.find(c => c.name == countryName);
  if (!country) {
    console.error('country not found: ' + countryName);
    return 0;
  }
  return country.num;
}

export function GetCountryFlagAndFifa(countryIsoNum): string {
  if (!countryIsoNum) {
    return '';
  }

  var country = countryCodes.find(c => c.num == countryIsoNum);
  if (!country) {
    console.error('no country found iso num: ' + countryIsoNum);
    return '';
  }

  return country.flag + country.fifa;
}
