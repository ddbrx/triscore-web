export interface AgeGroupCategory {
    name: string;
    groups: string[];
}

export function GetAgeGroupCategories(): AgeGroupCategory[] {
    return ageGroupCategories;
}

export function IsValidAgeGroup(group): boolean {
    for (let item of ageGroupCategories) {
        if (item.groups.findIndex(x => x == group) != -1) {
            return true;
        }
    };
    return false;
}

const ageGroupCategories: AgeGroupCategory[] = [
    {
        name: 'PRO',
        groups: [
            "MPRO",
            "FPRO",
        ]
    },
    {
        name: 'Male',
        groups: [
            "M18-24",
            "M25-29",
            "M30-34",
            "M35-39",
            "M40-44",
            "M45-49",
            "M50-54",
            "M55-59",
            "M60-64",
            "M65-69",
            "M70-74",
            "M75-79",
            "M80-84",
            "M85-89",
        ]
    },
    {
        name: 'Female',
        groups: [
            "F18-24",
            "F25-29",
            "F30-34",
            "F35-39",
            "F40-44",
            "F45-49",
            "F50-54",
            "F55-59",
            "F60-64",
            "F65-69",
            "F70-74",
            "F75-79",
            "F80-84",
            "F85-89",
        ]
    },
    {
        name: 'HC/PC',
        groups: [
            "HC",
            "PC",
        ]
    }
]
