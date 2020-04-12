

import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { GetCountryFlag, GetCountryNames, IsValidCountryName } from '../utils/country'
import { GetScoreStyle, GetFirstLetterStyle, GetScoreLevelShort } from '../utils/score-color'
import { FormControl } from '@angular/forms';
import { TriscoreApi, TriscoreRaceResult } from "../triscore-api/triscore-api";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AgeGroupCategory, GetAgeGroupCategories, IsValidAgeGroup } from "../utils/age-groups"

@Component({
  selector: 'app-race-details',
  styleUrls: ['race-details.component.css'],
  templateUrl: 'race-details.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RaceDetailsTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['overall-rank', 'name', 'country', 'age-group', 'finish', 'size', 'age-rank'];

  ageGroupControl = new FormControl();
  ageGroupCategories: AgeGroupCategory[];

  triscoreApi: TriscoreApi | null;
  results: TriscoreRaceResult[];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  athleteNameFilter = "";

  raceName: string;
  raceDate: string;

  countryControl = new FormControl();
  countryNames: string[];
  filteredCountryNames: Observable<string[]>;

  expandedElement: TriscoreRaceResult | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('table', { read: ElementRef }) table: ElementRef;

  constructor(
    private _httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.countryNames = GetCountryNames();
    this.filteredCountryNames = observableOf(this.countryNames);
    this.ageGroupCategories = GetAgeGroupCategories();
  }

  ngAfterViewInit() {
    this.triscoreApi = new TriscoreApi(this._httpClient);

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.navigateToCurrentParams();
    });

    this.countryControl.valueChanges.pipe(
      map(value => this.filterCountryName(value))
    ).subscribe(data => {
      if (IsValidCountryName(this.countryControl.value)) {
        this.paginator.pageIndex = 0;
        this.navigateToCurrentParams();
      } else {
        this.filteredCountryNames = observableOf(data)
      }
    });


    this.ageGroupControl.valueChanges.subscribe(data => {
      this.paginator.pageIndex = 0;
      this.navigateToCurrentParams();
    });

    this.route.queryParamMap.pipe(
      startWith(),
      switchMap(params => {
        this.isLoadingResults = true;

        if (this.needToFixParams(params)) {
          this.navigateToCurrentParams();
        }

        return this.triscoreApi!.getRaceResults(
          this.raceName, this.raceDate, this.athleteNameFilter, this.countryControl.value, this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.ageGroupControl.value);
      }),
      map(triscoreRacesResponse => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = triscoreRacesResponse.total;
        return triscoreRacesResponse.data;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(results => this.results = results);
  }

  needToFixParams(params) {
    var fixed = false;

    this.raceName = params.get('n');
    this.raceDate = params.get('d');

    var pageIndex = this.getValidPageIndex(params.get('pi') || '');
    if (pageIndex != this.paginator.pageIndex) {
      this.paginator.pageIndex = pageIndex;
      fixed = true;
    }

    var pageSize = this.getValidPageSize(params.get('ps') || '');
    if (pageSize != this.paginator.pageSize) {
      this.paginator.pageSize = pageSize;
      fixed = true;
    }

    var sortField = this.getValidSortField(params.get('s') || '');
    if (sortField != this.sort.active) {
      this.sort.active = sortField;
      fixed = true;
    }

    var sortOrder = this.getValidSortOrder(params.get('o') || '');
    if (sortOrder != this.sort.direction) {
      this.sort.direction = sortOrder;
      fixed = true;
    }

    var athleteName = this.getValidName(params.get('a') || '');
    if (athleteName != this.athleteNameFilter) {
      this.athleteNameFilter = athleteName;
      fixed = true;
    }

    var country = this.getValidCountry(params.get('c') || '');
    if (country != this.countryControl.value) {
      this.countryControl.setValue(country);
      fixed = true;
    }

    var ageGroup = this.getValidAgeGroup(params.get('g') || '');
    if (ageGroup != this.ageGroupControl.value) {
      this.ageGroupControl.setValue(ageGroup);
      fixed = true;
    }

    return fixed;
  }

  getValidPageIndex(page) {
    var pageIndex = parseInt(page);
    if (pageIndex >= 0) {
      return pageIndex;
    }
    return 0;
  }

  getValidPageSize(size) {
    var pageSize = parseInt(size);
    if (this.paginator.pageSizeOptions.findIndex(x => x == pageSize) != -1) {
      return pageSize;
    }
    return 0;
  }

  getValidSortField(sort) {
    if (sort == 'finish') {
      return sort;
    }
    return 'finish';
  }

  getValidSortOrder(order) {
    if (order == 'asc' || order == 'desc') {
      return order;
    }
    return 'asc';
  }

  getValidName(name: string) {
    var trimmedName = name.trim();
    if (trimmedName.length == 0 || trimmedName.length >= 3) {
      return trimmedName;
    }
    return '';
  }

  getValidCountry(country) {
    if (IsValidCountryName(country)) {
      return country;
    }
    return '';
  }

  getValidAgeGroup(group) {
    if (IsValidAgeGroup(group)) {
      return group;
    }
    return '';
  }

  onPageEvent(event) {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.table.nativeElement.scrollIntoView({ behavior: 'smooth' });
    this.navigateToCurrentParams();
  }

  nameFilterChanged() {
    this.paginator.pageIndex = 0;
    this.navigateToCurrentParams();
  }

  navigateToCurrentParams() {
    var queryParams = {};
    queryParams['n'] = this.raceName;
    queryParams['d'] = this.raceDate;
    queryParams['pi'] = this.paginator.pageIndex;
    queryParams['ps'] = this.paginator.pageSize;
    queryParams['s'] = this.sort.active;
    queryParams['o'] = this.sort.direction;
    queryParams['a'] = this.athleteNameFilter;
    queryParams['c'] = this.countryControl.value || '';
    queryParams['g'] = this.ageGroupControl.value || '';
    this.router.navigate(['/race'], { queryParams: queryParams, queryParamsHandling: 'merge' });
  }

  filterCountryName(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countryNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  getCountryFlag(countryName: string): string {
    return GetCountryFlag(countryName);
  }

  getScoreStyle(score: number) {
    return GetScoreStyle(score);
  }

  getFirstLetterStyle(score: number) {
    return GetFirstLetterStyle(score);
  }

  getScoreLevelShort(score: number) {
    return GetScoreLevelShort(score);
  }
}
