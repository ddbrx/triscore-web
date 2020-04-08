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
import { AthletesTableComponent } from './athletes/athletes.component';
import { AthleteDetailsTableComponent } from './athlete-details/athlete-details.component';
import { RacesTableComponent } from './races/races.component';
import { RaceDetailsTableComponent } from './race-details/race-details.component';
import { TopBarComponent } from './top-bar/top-bar.component';

import { RouteReuseService } from './route-reuse/route-reuse.service';

import { Router } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutPageComponent } from './about/about.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MarkdownModule } from 'ngx-markdown';


const appRoutes: Routes = [
  {
    path: 'athletes',
    component: AthletesTableComponent,
    data: { reuse: true },
  },
  {
    path: 'athlete/:profile',
    component: AthleteDetailsTableComponent,
  },
  {
    path: 'races',
    component: RacesTableComponent,
  },
  {
    path: 'race/:name/:date',
    component: RaceDetailsTableComponent,
  },
  {
    path: 'about',
    component: AboutPageComponent,
  },
  {
    path: '',
    redirectTo: 'athletes',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
    MarkdownModule.forRoot(),
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
    AthletesTableComponent,
    AthleteDetailsTableComponent,
    RaceDetailsTableComponent,
    RacesTableComponent,
    AboutPageComponent,
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
