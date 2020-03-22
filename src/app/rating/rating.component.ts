import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GetCountryFlag, GetCountryNames, IsValidCountryName } from '../utils/country'
import { GetScoreStyle, GetFirstLetterStyle } from '../utils/score-color'
import { FormControl } from '@angular/forms';
import { TriscoreAthlete, TriscoreApi } from "../triscore-api/triscore-api";

@Component({
  selector: 'app-rating',
  styleUrls: ['rating.component.css'],
  templateUrl: 'rating.component.html'
})
export class RatingTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['rank', 'name', 'country', 'group', 'races', 'rating'];

  triscoreApi: TriscoreApi | null;
  data: TriscoreAthlete[] = [];

  countryControl = new FormControl();
  countryNames: string[];
  filteredCountryNames: Observable<string[]>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  nameFilter = "";

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('table', { read: ElementRef }) table: ElementRef;

  constructor(
    private _httpClient: HttpClient,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.countryNames = GetCountryNames();
    this.filteredCountryNames = observableOf(this.countryNames);

    this.countryControl.valueChanges
      .pipe(
        map(value => this.filterCountryName(value))
      )
      .subscribe(data => {
        if (IsValidCountryName(this.countryControl.value)) {
          this.paginator.pageIndex = 0;
        }
        this.filteredCountryNames = observableOf(data)
      });
  }

  ngAfterViewInit() {
    this.triscoreApi = new TriscoreApi(this._httpClient);

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    this.findAthletes();
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

  nameFilterChanged() {
    this.paginator.pageIndex = 0;
    this.findAthletes();
  }

  onPageEvent() {
    this.table.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  findAthletes() {
    merge(this.sort.sortChange, this.paginator.page, this.countryControl.valueChanges)
      .pipe(
        startWith({}),
        filter(() => IsValidCountryName(this.countryControl.value)),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.triscoreApi!.getRating(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize, this.nameFilter, this.countryControl.value || '');
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          var queryParams = {}

          queryParams['from'] = this.paginator.pageIndex * this.paginator.pageSize;
          queryParams['to'] = (1 + this.paginator.pageIndex) * this.paginator.pageSize - 1;
          queryParams['sort'] = this.sort.active;
          queryParams['order'] = this.sort.direction;

          var trimmedNameFilter = this.nameFilter.trim();
          if (trimmedNameFilter.length != 0) {
            queryParams['name'] = trimmedNameFilter;
          }

          var trimmedCountryFilter = (this.countryControl.value || '').trim();
          if (trimmedCountryFilter.length != 0) {
            queryParams['country'] = trimmedCountryFilter;
          }

          this.router.navigate(['/rating'], { queryParams: queryParams });

          return data.athletes;
        }),
        catchError((error) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          console.error('failed to load data: ' + error);
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }
}
