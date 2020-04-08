import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { GetCountryFlag, GetCountryNames, IsValidCountryName } from '../utils/country'
import { GetScoreStyle, GetFirstLetterStyle } from '../utils/score-color'
import { FormControl } from '@angular/forms';
import { TriscoreAthlete, TriscoreApi } from "../triscore-api/triscore-api";


@Component({
  selector: 'app-athletes',
  styleUrls: ['athletes.component.css'],
  templateUrl: 'athletes.component.html'
})
export class AthletesTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['rank', 'name', 'country', 'group', 'races', 'score'];

  triscoreApi: TriscoreApi | null;
  triscoreAthletes: TriscoreAthlete[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  nameFilter = "";

  countryControl = new FormControl();
  countryNames: string[];
  filteredCountryNames: Observable<string[]>;

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

    this.route.queryParamMap.pipe(
      startWith(),
      switchMap(params => {
        this.isLoadingResults = true;
        if (this.needToFixParams(params)) {
          this.navigateToCurrentParams();
        }
        return this.triscoreApi!.getAthletes(
          this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.nameFilter, this.countryControl.value);
      }),
      map(triscoreAthletes => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = triscoreAthletes.total_count;
        return triscoreAthletes.athletes;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(triscoreAthletes => this.triscoreAthletes = triscoreAthletes);
  }

  needToFixParams(params) {
    var fixed = false;

    var pageIndex = this.getValidPageIndex(params.get('page') || '');
    if (pageIndex != this.paginator.pageIndex) {
      this.paginator.pageIndex = pageIndex;
      fixed = true;
    }

    var pageSize = this.getValidPageSize(params.get('size') || '');
    if (pageSize != this.paginator.pageSize) {
      this.paginator.pageSize = pageSize;
      fixed = true;
    }

    var sortField = this.getValidSortField(params.get('sort') || '');
    if (sortField != this.sort.active) {
      this.sort.active = sortField;
      fixed = true;
    }

    var sortOrder = this.getValidSortOrder(params.get('order') || '');
    if (sortOrder != this.sort.direction) {
      this.sort.direction = sortOrder;
      fixed = true;
    }

    var name = this.getValidName(params.get('name') || '');
    if (name != this.nameFilter) {
      this.nameFilter = name;
      fixed = true;
    }

    var country = this.getValidCountry(params.get('country') || '');
    if (country != this.countryControl.value) {
      this.countryControl.setValue(country);
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
    if (sort == 'score' || sort == 'races') {
      return sort;
    }
    return 'score';
  }

  getValidSortOrder(order) {
    if (order == 'asc' || order == 'desc') {
      return order;
    }
    return 'desc';
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
    queryParams['page'] = this.paginator.pageIndex;
    queryParams['size'] = this.paginator.pageSize;
    queryParams['sort'] = this.sort.active;
    queryParams['order'] = this.sort.direction;
    queryParams['name'] = this.nameFilter;
    queryParams['country'] = this.countryControl.value || '';
    this.router.navigate(['/athletes'], { queryParams: queryParams, queryParamsHandling: 'merge'});
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
}
