export function GetRaceTypes(): string[] {
    return raceTypes;
}

export function IsValidRaceType(raceType: string): boolean {
    return raceTypes.findIndex(x => x == raceType) != -1;
}

const raceTypes: string[] = [
    'half',
    'full'
];
