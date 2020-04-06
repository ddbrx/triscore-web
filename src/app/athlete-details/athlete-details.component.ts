
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GetCountryFlag } from '../utils/country'
import { GetScoreColor, GetScoreStyle, GetFirstLetterStyle, GetScoreLevel } from '../utils/score-color'
import { TriscoreAthlete, TriscoreApi, TriscoreRaceResult } from "../triscore-api/triscore-api";
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-athlete-details',
  styleUrls: ['athlete-details.component.css'],
  templateUrl: 'athlete-details.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AthleteDetailsTableComponent implements OnInit {
  objectKeys = Object.keys;

  triscoreApi: TriscoreApi | null;
  athlete$: Observable<TriscoreAthlete>;
  plotData: any;
  gaugeData: any;

  swimAvgPerf: number;
  bikeAvgPerf: number;
  runAvgPerf: number;
  rankAvgPerf: number;

  expandedElement: TriscoreRaceResult | null;

  displayedColumns: string[] = [
    'index', 'date', 'race', 'type', 'status', 'time', 'group', 'size', 'rank', 'seed', 'time_rank', 'delta', 'score', 'level'];

  margin = { top: 40, right: 20, bottom: 30, left: 40 };

  view: any[] = [700, 300];

  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Score';
  timeline: boolean = false;
  autoScale: boolean = true;
  gradient: boolean = true;

  colorScheme = {};

  gaugeColorScheme = {};
  gaugeView: any[] = [350, 300];
  gaugeShowText: boolean = true;
  gaugeSmallSegments: number = 5;
  gaugeBigSegments: number = 5;
  gaugeUnits: string = "";
  gaugeStartAngle: number = -120;
  gaugeAngleSpan: number = 240;

  gaugeValueFormatting: any;

  constructor(
    private _httpClient: HttpClient,
    private route: ActivatedRoute,
  ) {
    this.gaugeValueFormatting = this.formatGaugeValue.bind(this)
  }

  formatGaugeValue(value): string {
    if (value == this.swimAvgPerf + this.bikeAvgPerf + this.runAvgPerf) {
      return this.rankAvgPerf ? this.rankAvgPerf.toString() + '%' : '0%';
    }
    return value.toString() + '%';
  }

  getCountryFlag(countryName: string): string {
    return GetCountryFlag(countryName);
  }

  getColorScheme(score: number) {
    var scoreColor = GetScoreColor(score);
    return {
      domain: [scoreColor],
      selectable: true,
      group: 'Ordinal',
    };
  }

  getGaugeColorScheme() {
    return {
      domain: ['#9EBAEF', '#5AA454', '#E44D24'],
      selectable: true,
      group: 'Ordinal',
    };
  }

  getScoreStyle(score: number) {
    return GetScoreStyle(score);
  }

  getFirstLetterStyle(score: number) {
    return GetFirstLetterStyle(score);
  }

  getScoreLevel(score: number) {
    return GetScoreLevel(score);
  }

  ngOnInit() {
    this.triscoreApi = new TriscoreApi(this._httpClient);
    this.athlete$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.triscoreApi!.getAthleteDetails(params.get('profile'));
      }
      ),
      map(data => {
        var series = new Array();

        var minScore = 0;
        var maxScore = 0;

        var swimKm = 0;
        var bikeKm = 0;
        var runKm = 0;

        const kSwimKmFull = 3.86;
        const kBikeKmFull = 180;
        const kRunKmFull = 42.2;

        if (data.h.length > 0) {
          var first_result = data.h[0];
          minScore = first_result.ps;
          maxScore = first_result.ps;
          var start_date = new Date(first_result.date.substr(0, 10));
          start_date.setDate(start_date.getDate() - 1);

          var start_item = {
            'name': start_date,
            'value': first_result.ps,
            'min': minScore,
            'max': maxScore,
          }
          series.push(start_item);
        }

        data.h.forEach(result => {
          var completedSwimKm = kSwimKmFull;
          var completedBikeKm = kBikeKmFull;
          var completedRunKm = kRunKmFull;

          if (result.type == 'half') {
            completedSwimKm /= 2;
            completedBikeKm /= 2;
            completedRunKm /= 2;
          }

          if (result.legs.s.t != 99999) {
            swimKm += completedSwimKm;
          }
          if (result.legs.b.t != 99999) {
            bikeKm += completedBikeKm;
          }
          if (result.legs.r.t != 99999) {
            runKm += completedRunKm;
          }

          minScore = Math.min(minScore, result.ns);
          maxScore = Math.max(maxScore, result.ns);
          var item = {
            'name': new Date(result.date.substr(0, 10)),
            'value': result.ns,
            'min': minScore,
            'max': maxScore,
            'extra': {
              'race': result.race,
              'group': result.a,
              'size': result.as,
              'rank': result.tr,
              'seed': result.sr,
              'delta': result.da,
            }
          };

          series.push(item);
        });

        var filteredSwim = data.h.filter(result => result.legs.s.t != 99999).map(result => (result.as - result.legs.s.tar) / (result.as - 1.));
        var filteredBike = data.h.filter(result => result.legs.b.t != 99999).map(result => (result.as - result.legs.b.tar) / (result.as - 1.));
        var filteredRun = data.h.filter(result => result.legs.r.t != 99999).map(result => (result.as - result.legs.r.tar) / (result.as - 1.));
        var filteredRank = data.h.filter(result => result.t != 99999).map(result => (result.as - result.tar) / (result.as - 1.));

        this.swimAvgPerf = this.toFormattedPercent(this.getAverageOrZero(filteredSwim));
        this.bikeAvgPerf = this.toFormattedPercent(this.getAverageOrZero(filteredBike));
        this.runAvgPerf = this.toFormattedPercent(this.getAverageOrZero(filteredRun));
        this.rankAvgPerf = this.toFormattedPercent(this.getAverageOrZero(filteredRank));

        this.gaugeData = [
          {
            'name': 'Swim Perfomance',
            'value': this.swimAvgPerf
          },
          {
            'name': 'Bike Perfomance',
            'value': this.bikeAvgPerf
          },
          {
            'name': 'Run Perfomance',
            'value': this.runAvgPerf
          }
        ];

        this.plotData = [{ 'name': data.n, 'series': series }];
        this.colorScheme = this.getColorScheme(data.s);
        this.gaugeColorScheme = this.getGaugeColorScheme();

        return data;
      })
    );
  }

  getAverageOrZero(arr) {
    return arr.length > 0 ? arr.reduce((a, b) => a + b) / arr.length : 0.;
  }

  toFormattedPercent(d) {
    return Math.round(1000. * d) / 10.;
  }
}
