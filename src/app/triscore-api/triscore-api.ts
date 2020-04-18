import { HttpClient } from '@angular/common/http';
import { GetCountryFifaCodeByName } from '../utils/country'
import { Observable } from 'rxjs';

const MAX_PAGE_SIZE: number = 100;

interface TriscoreAthletesResponse {
    data: TriscoreAthlete[];
    total: number;
}

export interface TriscoreAthleteDetailsResponse {
    data: TriscoreAthlete;
    total: number;
}

export interface TriscoreRacesResponse {
    data: TriscoreRaceInfo[];
    total: number;
}

export interface TriscoreRaceInfoResponse {
    data: TriscoreRaceInfo;
    total: number;
}

export interface TriscoreRaceResultsResponse {
    data: TriscoreRaceResult[];
    total: number;
}


export interface TriscoreAthlete {
    id: number;
    qr: number;
    r: number;
    c: string;
    n: string;
    a: string;
    p: number;
    s: number;
    h: TriscoreAthleteHistoryResult[];
}

export interface TriscoreAthleteHistoryResult {
    index: number;
    race: string;
    date: string;
    brand: string;
    type: string;
    rc: string;
    c: string;
    b: number;
    st: string;
    t: number;
    a: string;
    as: number;
    ar: number;
    tar: number;
    g: string;
    gs: number;
    gr: number;
    tgt: number;
    os: number;
    or: number;
    tor: number;

    tr: number;
    sr: number;
    ps: number;
    ns: number;
    da: number;

    legs: {
        s: TriscoreLeg;
        t1: TriscoreLeg;
        b: TriscoreLeg;
        t2: TriscoreLeg;
        r: TriscoreLeg;
    };
}

export interface TriscoreLeg {
    t: number;
    ar: number;
    gr: number;
    or: number;
    tar: number;
    tgr: number;
    tor: number;
}




export interface TriscoreRaceInfo {
    name: string;
    date: string;
    brand: string;
    type: string;
    location: TriscoreRaceLocation;
    distance: TriscoreRaceDistance;
    stats: TriscoreRaceStats;
    results: TriscoreRaceResult[];
}

export interface TriscoreRaceResult {
    ps: number;
    ns: number;

    id: string;
    n: string;
    c: string;
    b: number;
    st: string;
    t: number;
    a: string;
    as: number;
    ar: number;
    g: string;
    gs: number;
    gr: number;
    os: number;
    or: number;

    legs: {
        s: TriscoreLeg;
        t1: TriscoreLeg;
        b: TriscoreLeg;
        t2: TriscoreLeg;
        r: TriscoreLeg;
    };
}

export interface TriscoreRaceLocation {
    d: string;
    ct: string;
    cy: string;
    c: string;
}

export interface TriscoreRaceDistance {
    s: TriscoreSwimInfo;
    b: TriscoreBikeInfo;
    r: TriscoreRunInfo;
}

export interface TriscoreSwimInfo {
    d: number;
    t: string;
    e: number;
}

export interface TriscoreBikeInfo {
    d: number;
    s: number;
    e: number;
}

export interface TriscoreRunInfo {
    d: number;
    s: number;
    e: number;
}

export interface TriscoreRaceStats {
    t: number;
    s: number;
    p: string;
    m: number;
    f: number;
}

export class TriscoreApi {
    private kHost: string = 'https://triscore.me/api/v1';
    // private kHost: string = 'http://127.0.0.1:5000';
    // private kHost: string = 'http://static.135.98.202.116.clients.your-server.de';

    constructor(private _httpClient: HttpClient) { }

    getAthletes(pageIndex: number, pageSize: number, sort: string, order: string, name: string, country: string, ageGroup: string):
        Observable<TriscoreAthletesResponse> {
        // console.log('getAthletes: pageIndex: ' + pageIndex + ' pageSize: ' + pageSize + ' sort: ' + sort + ' order: ' + order + ' name: ' + name + ' country: ' + country);
        if (pageSize > MAX_PAGE_SIZE) {
            pageSize = MAX_PAGE_SIZE;
        }
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
        if (ageGroup.length > 0) {
            requestUrl += `&group=${ageGroup}`;
        }
        return this._httpClient.get<TriscoreAthletesResponse>(requestUrl);
    }

    getAthleteDetails(profile: string): Observable<TriscoreAthleteDetailsResponse> {
        var requestUrl = `${this.kHost}/athlete-details?id=${profile}`;
        return this._httpClient.get<TriscoreAthleteDetailsResponse>(requestUrl);
    }

    getRaces(pageIndex: number, pageSize: number, sort: string, order: string, name: string, country: string, raceType: string): Observable<TriscoreRacesResponse> {
        // console.log('getRaces: pageIndex: ' + pageIndex + ' pageSize: ' + pageSize + ' sort: ' + sort + ' order: ' + order + ' name: ' + name + ' country: ' + country);
        if (pageSize > MAX_PAGE_SIZE) {
            pageSize = MAX_PAGE_SIZE;
        }
        var from: number = pageIndex * pageSize;
        var to: number = from + pageSize - 1;
        var requestUrl = `${this.kHost}/races?sort=${sort}&order=${order}&from=${from}&to=${to}&name=${name}&type=${raceType}`;
        if (country.length > 0) {
            var countryFifaCode = GetCountryFifaCodeByName(country);
            requestUrl += `&country=${countryFifaCode}`;
        }
        return this._httpClient.get<TriscoreRacesResponse>(requestUrl);
    }


    getRaceInfo(name: string, date: string): Observable<TriscoreRaceInfoResponse> {
        var requestUrl = `${this.kHost}/race-info?name=${name}&date=${date}`;
        return this._httpClient.get<TriscoreRaceInfoResponse>(requestUrl);
    }

    getRaceResults(race_name: string, race_date: string, athlete: string, country: string, pageIndex: number, pageSize: number, sort: string, order: string, ageGroup: string): Observable<TriscoreRaceResultsResponse> {
        var skip = pageIndex * pageSize;
        var limit = pageSize;

        var requestUrl = `${this.kHost}/race-results?name=${race_name}&date=${race_date}&athlete=${athlete}&skip=${skip}&limit=${limit}&sort=${sort}&order=${order}&group=${ageGroup}`;

        if (country.length > 0) {
            var countryFifaCode = GetCountryFifaCodeByName(country);
            requestUrl += `&country=${countryFifaCode}`;
        }
        return this._httpClient.get<TriscoreRaceResultsResponse>(requestUrl);
    }
}
