
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GetCountryFlagAndFifa } from '../utils/country'
import { GetScoreColor, GetScoreStyle, GetFirstLetterStyle, GetScoreLevel, GetScoreLevelShort } from '../utils/score-color'
import { TriscoreAthlete, TriscoreApi, TriscoreRaceResult } from "../triscore-api/triscore-api";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  maxScore: number | null;

  plotData: any;

  swimAvgPerf: number;
  bikeAvgPerf: number;
  runAvgPerf: number;
  rankAvgPerf: number;

  expandedElement: TriscoreRaceResult | null;

  displayedColumns: string[];

  margin = { top: 40, right: 20, bottom: 30, left: 40 };

  raceStatsGradient: boolean = false;
  raceStatsAnimations: boolean = false;
  raceStatsShowXAxis: boolean = false;
  raceStatsShowYAxis: boolean = true;
  raceStatsShowDataLabel: boolean = true;
  raceStatsRoundDomains: boolean = true;
  raceStatsBarPadding: number = 4;

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

  gaugeData: any;
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
    private deviceService: DeviceDetectorService,
  ) {
    this.gaugeValueFormatting = this.formatGaugeValue.bind(this);
    this.displayedColumns = this.getDeviceDisplayedColumns();
  }

  getDeviceDisplayedColumns() {
    if (this.deviceService.isMobile()) {
      return ['race', 'age-group', 'finish', 'delta', 'score', 'level']
    }
    return ['index', 'race', 'date', 'age-group', 'size', 'rank', 'finish', 'delta', 'score', 'level'];
  }

  getDeviceAthleteSummaryStyle() {
    if (this.deviceService.isMobile()) {
      return {};
    }
    return {
      width: '30%',
      position: 'relative',
      float: 'left',
      'margin-left': '15%',
      'padding-top': '4%',
    };
  }

  getDeviceAthleteDescriptionStyle() {
    if (this.deviceService.isMobile()) {
      return {
        'margin-left': '5%',
        width: '45%',
        position: 'relative',
        float: 'left',
      }
    }
    return {
      'margin-left': '20%',
      'padding-bottom': '5%',
    }
  }

  getDeviceAthleteStatsStyle() {
    if (this.deviceService.isMobile()) {
      return {
        'margin-left': '50%',
        'margin-top': '5%',
        'padding-top': '5%',
        height: '50px',
        width: '190px',
      };
    }
    return {
      height: '60px',
      width: '240px',
    }
  }

  getDeviceAthleteGaugeStyle() {
    if (this.deviceService.isMobile()) {
      return {
        'margin-left': '3%',
        width: '350px',
        height: '250px',
      };
    }
    return {
      'margin-left': '50%',
      'padding-top': '1%',
      width: '350px',
      height: '300px',
    }
  }

  isMobile() {
    return this.deviceService.isMobile();
  }

  formatGaugeValue(value): string {
    if (value == this.swimAvgPerf + this.bikeAvgPerf + this.runAvgPerf) {
      return this.rankAvgPerf ? this.rankAvgPerf.toString() + '%' : '0%';
    }
    return value.toString() + '%';
  }

  getCountryFlagAndFifa(countryName: string): string {
    return GetCountryFlagAndFifa(countryName);
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

  getRaceStatsColorScheme(athlete: TriscoreAthlete) {
    return {
      domain: [GetScoreColor(athlete.s), '#ada8a8'],
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

  getScoreLevelShort(score: number) {
    return GetScoreLevelShort(score);
  }

  getDeviceScoreLevel(score: number) {
    if (this.deviceService.isMobile()) {
      return GetScoreLevelShort(score);
    }
    return GetScoreLevel(score);
  }

  getMaxScore(athlete: TriscoreAthlete) {
    if (!this.maxScore) {
      this.maxScore = Math.max.apply(Math, athlete.h.map(x => Math.max(x.ns, x.ps)));
    }
    return this.maxScore;
  }

  getTotalRacesCount(athlete: TriscoreAthlete) {
    return athlete.h.length;
  }

  getNotFinishedRacesCount(athlete: TriscoreAthlete, type: string) {
    return athlete.h.filter(item => item.type == type && item.st != 'ok').length;
  }

  getFinishedRacesCount(athlete: TriscoreAthlete, type: string) {
    return athlete.h.filter(item => item.type == type && item.st == 'ok').length;
  }

  getRaceStatsData(athlete: TriscoreAthlete) {
    return [
      {
        'name': 'Full',
        'series': [
          {
            'name': 'Completed',
            'value': this.getFinishedRacesCount(athlete, 'full')
          },
          {
            'name': 'Not Finished',
            'value': this.getNotFinishedRacesCount(athlete, 'full')
          }
        ]
      },
      {
        'name': 'Half',
        'series': [
          {
            'name': 'Completed',
            'value': this.getFinishedRacesCount(athlete, 'half')
          },
          {
            'name': 'Not Finished',
            'value': this.getNotFinishedRacesCount(athlete, 'half')
          }
        ]
      }
    ]
  }

  getLevelChangeSymbol(oldScore: number, newScore: number) {
    if (this.getScoreLevel(oldScore) != this.getScoreLevel(newScore)) {
      if (newScore >= oldScore) {
        return '▲';
      } else {
        return '▼';
      }
    }
    return '';
  }

  ngOnInit() {
    this.triscoreApi = new TriscoreApi(this._httpClient);
    this.athlete$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.triscoreApi!.getAthleteDetails(params.get('profile'));
      }
      ),
      map(athleteDetailsResponse => {
        var series = new Array();

        var minScore = 0;
        var maxScore = 0;

        var swimKm = 0;
        var bikeKm = 0;
        var runKm = 0;

        const kSwimKmFull = 3.86;
        const kBikeKmFull = 180;
        const kRunKmFull = 42.2;

        var athlete = athleteDetailsResponse.data;
        if (athlete.h.length > 0) {
          var first_result = athlete.h[0];
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

        athlete.h.forEach(result => {
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
              'rank': result.ar,
              'delta': result.da
            }
          };

          series.push(item);
        });

        var filteredSwim = athlete.h.filter(result => result.legs.s.t != 99999 && result.as != 1).map(result => (result.as - result.legs.s.tar) / (result.as - 1.));
        var filteredBike = athlete.h.filter(result => result.legs.b.t != 99999 && result.as != 1).map(result => (result.as - result.legs.b.tar) / (result.as - 1.));
        var filteredRun = athlete.h.filter(result => result.legs.r.t != 99999 && result.as != 1).map(result => (result.as - result.legs.r.tar) / (result.as - 1.));
        var filteredRank = athlete.h.filter(result => result.t != 99999 && result.as != 1).map(result => (result.as - result.tar) / (result.as - 1.));

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

        this.plotData = [{ 'name': athlete.n, 'series': series }];
        this.colorScheme = this.getColorScheme(athlete.s);
        this.gaugeColorScheme = this.getGaugeColorScheme();

        return athlete;
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
