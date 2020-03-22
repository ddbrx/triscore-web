import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { DemoMaterialModule } from './utils/material-module';
import { RatingTableComponent } from './rating/rating.component';
import { RacesTableComponent } from './races/races.component';
import { AthleteDetailsTableComponent } from './athlete/athlete.component';
import { TopBarComponent } from './top-bar/top-bar.component';

import { RouteReuseService } from './route-reuse/route-reuse.service';
import { NgxCharComponent } from './ngxchart/ngxchart.component';

import { Router } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomePageComponent } from './home/home.component';
import { ContactPageComponent } from './contact/contact.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';



const appRoutes: Routes = [
  {
    path: 'athlete/:profile',
    component: AthleteDetailsTableComponent,
    data: { reuse: false },
  },
  {
    path: 'rating',
    component: RatingTableComponent,
    data: { reuse: false },
  },
  // {
  //   path: 'races',
  //   component: RacesTableComponent,
  //   data: { reuse: false },
  // },
  {
    path: 'contact',
    component: ContactPageComponent,
    data: { reuse: false },
  },
  {
    path: '',
    component: HomePageComponent,
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    NgxChartsModule,
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    RatingTableComponent,
    AthleteDetailsTableComponent,
    RacesTableComponent,
    NgxCharComponent,
    HomePageComponent,
    ContactPageComponent,
    PageNotFoundComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: RouteReuseStrategy, useClass: RouteReuseService },
  ]
})

export class AppModule {
  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    // Use a custom replacer to display function names in the route configs
    // const replacer = (key, value) => (typeof value === 'function') ? value.name : value;
    // console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */