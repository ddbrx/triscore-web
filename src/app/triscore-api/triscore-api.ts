import { HttpClient } from '@angular/common/http';
import { GetCountryFifaCodeByName } from '../utils/country'
import { Observable } from 'rxjs';

export interface TriscoreAthlete {
    id: number;
    rank: number;
    country: string;
    name: string;
    profile: string;
    group: string;
    races: number;
    rating: number;
    history: TriscoreRaceResult[];
}

export interface TriscoreRaceResult {
    index: number;
    date: string;
    name: string;
    type: string;
    group: string;
    splits: {
        swim: number;
        t1: number;
        bike: number;
        t2: number;
        run: number;
    };
    finish: number;
    size: number;
    rank: number;
    seed: number;
    rating_before: number;
    rating_after: number;
    rating_delta: number;
}

interface TriscoreRating {
    athletes: TriscoreAthlete[];
    total_count: number;
}

export class TriscoreApi {
    private kHost: string = 'http://127.0.0.1:5000';

    constructor(private _httpClient: HttpClient) { }

    getRating(sort: string, order: string, pageIndex: number, pageSize: number, name: string, country: string): Observable<TriscoreRating> {
        var from: number = pageIndex * pageSize;
        var to: number = from + pageSize - 1;
        var requestUrl = `${this.kHost}/athletes?sort=${sort}&order=${order}&from=${from}&to=${to}`;
        if (name.length > 0) {
            requestUrl += `&name=${name}`;
        }
        if (country.length > 0) {
            var countryFifaCode = GetCountryFifaCodeByName(country);
            requestUrl += `&country=${countryFifaCode}`;
        }
        return this._httpClient.get<TriscoreRating>(requestUrl);
    }

    getAthleteDetails(profile: string): Observable<TriscoreAthlete> {
        var requestUrl = `${this.kHost}/athlete-details?profile=${profile}`;
        return this._httpClient.get<TriscoreAthlete>(requestUrl);
    }
}
