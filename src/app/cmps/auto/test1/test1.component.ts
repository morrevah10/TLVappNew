import { Component, OnInit, ViewChild  } from '@angular/core';
import { DataService } from '../data.service';
import { FormControl } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.scss'],
})
export class Test1Component implements OnInit {
  
  cityFilterControl = new FormControl();
  streetFilterControl = new FormControl({ value: '', disabled: true });

  filteredCities$!: Observable<string[]>;
  filteredStreets$!: Observable<string[]>;

  selectedCity: string  = '';
  filteredStreets: string[] = [];



  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;


  constructor(private dataService: DataService) {}


  ngOnInit() {
    this.filteredCities$ = this.dataService.getCities();
    // this.filteredStreets$ = this.dataService.getStreets();
    this.filteredStreets$ = this.dataService.streetSubject.asObservable();

    // Subscribe to changes in the city filter input
    this.cityFilterControl.valueChanges.subscribe((filterValue) => {
      this.dataService.updateCityFilter(filterValue);
    });

    // Subscribe to changes in the selected city
    this.cityFilterControl.valueChanges.subscribe((selectedCity) => {
      console.log('Selected City:', selectedCity);
      this.selectedCity = selectedCity;
      if (selectedCity !== null) {
        this.streetFilterControl.enable();
        this.streetFilterControl.setValue('');
      } else {
        this.streetFilterControl.disable();
      }
    });

    // this.streetFilterControl.valueChanges.subscribe((filterValue) => {
    //   console.log('Street Filter Value:', filterValue);
    //   const streetFilter = filterValue ?? '';
    //   if (this.selectedCity !== null) {
    //     this.dataService.updateStreetFilter(this.selectedCity, streetFilter);
    //   } else {
    //     // Handle the case when no city is selected
    //     this.dataService.updateStreetFilter(null, streetFilter);
    //   }
    // });


    // Subscribe to changes in the street filter input value
    this.streetFilterControl.valueChanges.subscribe((filterValue) => {
      const trimmedFilter = filterValue!.trim();
      if (this.selectedCity !== null) {
        // Update filteredStreets$ based on the selected city and user input filter
        this.dataService.updateStreetFilter(this.selectedCity, trimmedFilter);
      } else {
        // Handle the case when no city is selected
        this.dataService.updateStreetFilter(null, trimmedFilter);
      }
    });
  
    // Subscribe to filteredStreets$ and update the filteredStreets property
    console.log('Subscribing to filteredStreets$');
    this.dataService.streetSubject.asObservable().subscribe((streets) => {
      this.filteredStreets = streets;
      console.log('Filtered Streets:', this.filteredStreets);
    });

    
  }
}
