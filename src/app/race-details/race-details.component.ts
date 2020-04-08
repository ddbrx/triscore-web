import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { TriscoreRace, TriscoreRaceResult, TriscoreRaceDetailsResult, TriscoreApi, TriscoreRaceDetailsResponse } from "../triscore-api/triscore-api";
import { GetCountryFlag, GetCountryNames, IsValidCountryName } from '../utils/country'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GetScoreStyle, GetFirstLetterStyle } from '../utils/score-color'

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
  displayedColumns: string[] = ['rank', 'name', 'country', 'group', 'time'];

  triscoreApi: TriscoreApi | null;
  race: TriscoreRaceDetailsResult;
  results: TriscoreRaceResult[];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  expandedElement: TriscoreRaceResult | null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { read: ElementRef }) table: ElementRef;

  constructor(
    private _httpClient: HttpClient,
    private route: ActivatedRoute
  ) {
  }

  ngAfterViewInit() {
    this.triscoreApi = new TriscoreApi(this._httpClient);

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.updateData();
    });

    this.updateData();
  }

  updateData() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.isLoadingResults = true;
        return this.triscoreApi!.getRaceDetails(
          params.get('name'), params.get('date'), this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction
        );
      }),
      map(triscoreRaceDetailsResponse => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = triscoreRaceDetailsResponse.data[0].stats.t;
        return triscoreRaceDetailsResponse.data;
      })
    )
      .subscribe(data => {
        this.race = data[0];
        this.results = data.map(x => x.results);
      });
  }

  onPageEvent(event) {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.updateData();
    this.table.nativeElement.scrollIntoView({ behavior: 'smooth' });
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
