
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GetCountryFlag } from '../utils/country'
import { GetScoreColor, GetScoreStyle, GetFirstLetterStyle } from '../utils/score-color'
import { TriscoreAthlete, TriscoreApi } from "../triscore-api/triscore-api";

@Component({
  selector: 'app-athlete',
  styleUrls: ['athlete.component.css'],
  templateUrl: 'athlete.component.html',
})
export class AthleteDetailsTableComponent implements OnInit {
  triscoreApi: TriscoreApi | null;
  athlete$: Observable<TriscoreAthlete>;
  races: Array<any>;
  plotData: any;

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

  constructor(
    private _httpClient: HttpClient,
    private route: ActivatedRoute,
  ) { }

  getCountryFlag(countryName: string): string {
    return GetCountryFlag(countryName);
  }

  getColorScheme(score: number) {
    console.log('score: ' + score);
    var scoreColor = GetScoreColor(score);
    return {
      domain: [scoreColor],
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

  ngOnInit() {
    this.triscoreApi = new TriscoreApi(this._httpClient);
    this.athlete$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.triscoreApi!.getAthleteDetails(params.get('profile'));
      }
      ),
      map(data => {
        this.races = data.history;

        var series = new Array();
        data.history.forEach(race => {
          var item = {
            'name': new Date(race.date.substr(0, 10)),
            'value': race.rating_after,
            'extra': {
              'race': race.name,
              'group': race.group,
              'size': race.size,
              'rank': race.rank,
              'seed': race.seed,
              'delta': race.rating_delta,
            }
          };
          series.push(item);
        });

        this.plotData = [{ 'name': data.name, 'series': series }];
        this.colorScheme = this.getColorScheme(data.rating);

        return data;
      })
    );
  }
}
