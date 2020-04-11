import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GetScoreStyle, GetFirstLetterStyle, GetScoreLevel } from '../utils/score-color'
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutPageComponent implements AfterViewInit {

  fragment: string;

  constructor(private route: ActivatedRoute) { }

  ngAfterViewInit() {
    this.route.fragment.subscribe(f => {
      if (f && this.fragment != f) {
        const element = document.querySelector("#" + f);
        if (element) {
          element.scrollIntoView();
        }
        this.fragment = f;
      }
    })
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
}