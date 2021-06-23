import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { GetCountryFlagAndFifa, GetCountryNames, IsValidCountryName } from '../utils/country'


@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingPageComponent {
  nickname = "";
  team = "";
  countryControl = new FormControl();
  countryNames: string[];
  filteredCountryNames: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.countryNames = GetCountryNames();
    this.filteredCountryNames = observableOf(this.countryNames);
    // this.newAthleteFrom = this.formBuilder.group({
    //   name: '',
    //   address: ''
    // });
  }

  ngOnInit() {
  }

  onSubmit() {
    // Process checkout data here
    // console.warn('Your order has been submitted', customerData);
  }
}
