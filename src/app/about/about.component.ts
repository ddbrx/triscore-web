import { Component, OnInit } from '@angular/core';
import { GetScoreColor, GetScoreStyle, GetFirstLetterStyle, GetScoreLevel } from '../utils/score-color'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getScoreStyle(score: number) {
    return GetScoreStyle(score);
  }
  getFirstLetterStyle(score: number) {
    return GetFirstLetterStyle(score);
  }
}