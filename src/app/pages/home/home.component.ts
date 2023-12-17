import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/srvices/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { SearchService } from 'src/app/srvices/search.service';
import { AbstractControl, FormsModule, ValidationErrors } from '@angular/forms';
import { PostService } from 'src/app/srvices/post.service';
import { ApartmentListComponent } from 'src/app/cmps/apartment/apartment-list/apartment-list.component';
import { HttpClient } from '@angular/common/http';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { MatAutocomplete } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import {
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs';

import { DataService } from 'src/app/srvices/data.service';

interface Apartment {
  post_id: number;
  post_city: string;
  post_street: string;
  post_building_number: string;
  post_apartment_number: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(ApartmentListComponent) apartmentList!: ApartmentListComponent;
  
 
  fakeData!: any[][];
  searchForm!: FormGroup;

  isValidSearch = false
  logedinUser: User | null = null;
  search = {
    post_city: '',
    post_street: '',
    post_apartment_number: '',
    post_bulding_number: '',
  };

  greetingMessage: string = '';
  filteredCities: string[] = [];

  isDisable = false;
  apartmentControl = new FormControl();
  buildingControl = new FormControl();
  errorMessage = '';

  // cityFilterControl = new FormControl();
  // streetFilterControl = new FormControl({ value: '', disabled: true });

  cityFilterControl = new FormControl('', [Validators.required, this.cityValidator.bind(this)]);
  streetFilterControl = new FormControl({ value: '', disabled: true }, [Validators.required, this.streetValidator.bind(this)]);

  filteredCities$!: Observable<string[]>;
  filteredStreets$!: Observable<string[]>;

  selectedCity: string = '';
  filteredStreets: string[] = [];

  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;
  loading: boolean = false;

  isAuthenticated = false;
  windowWidth!: number;

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    private postservice: PostService,
    private dataService: DataService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {  }

  // Custom validator for the city control
  cityValidator(control: AbstractControl): ValidationErrors | null {
    const selectedCity = control.value;
    if (this.filteredCities.length > 0 && !this.filteredCities.includes(selectedCity)) {
      return { invalidCity: true };
    }
    return null;
  }

  // Custom validator for the street control
  streetValidator(control: AbstractControl): ValidationErrors | null {
    const selectedStreet = control.value;
    if (this.filteredStreets.length > 0 && !this.filteredStreets.includes(selectedStreet)) {
      return { invalidStreet: true };
    }
    return null;
  }
  
  ngOnInit() {
    console.log('HomeComponent initialized');
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      if (user) {
        this.logedinUser = user;
        this.cdr.detectChanges();
        this.isAuthenticated = true;
      }
    });
    this.windowWidth = window.innerWidth;
    this.streetFilterControl.disable();

    this.setGreetingMessage();
    // this.filteredCities$ = this.dataService.getCities();
    this.filteredCities$ = combineLatest([
      this.cityFilterControl.valueChanges.pipe(startWith('')),
      this.dataService.preprocessedCityData$,
    ]).pipe(
      debounceTime(300), // Debounce user input for 300 milliseconds
      distinctUntilChanged(), // Only emit if the filter has changed
      map(([filterValue, cityIndex]) => {
        // Fetch filtered cities from the preprocessed data
        const filteredCities = this.filterCities(cityIndex, filterValue!);
        return filteredCities;
      })
    );

    this.filteredStreets$ = this.dataService.streetSubject.asObservable();
    this.cityFilterControl.valueChanges.subscribe((filterValue) => {
      this.dataService.updateCityFilter(filterValue!);
    });

    this.cityFilterControl.valueChanges.subscribe((selectedCity) => {
      // console.log('Selected City:', selectedCity);
      this.selectedCity = selectedCity!;
    });

    combineLatest([
      this.cityFilterControl.valueChanges,
      this.streetFilterControl.valueChanges,
    ]).subscribe(([selectedCity, filterValue]) => {
      if (selectedCity !== null) {
        const trimmedFilter = filterValue!.trim();
        this.dataService.updateStreetFilter(selectedCity, trimmedFilter);
      }
    });
    // this.streetFilterControl.valueChanges.subscribe((filterValue) => {
    //   const trimmedFilter = filterValue!.trim();
    //   if (this.selectedCity !== null) {
    //     // Update filteredStreets$ based on the selected city and user input filter
    //     this.dataService.getStreetsByCity(this.selectedCity, trimmedFilter);
    //   }
    // });

    console.log('Subscribing to filteredStreets$');
    this.dataService.streetSubject.asObservable().subscribe((streets) => {
      this.filteredStreets = streets;
      // console.log('Filtered Streets:', this.filteredStreets);
    });


    

    this.searchForm = this.formBuilder.group({
      cityFilterControl: this.cityFilterControl,
      streetFilterControl: this.streetFilterControl,
      buildingControl: this.buildingControl,
      apartmentControl: this.apartmentControl,
    });




  }


  
  
  private filterCities(cityIndex: { [letter: string]: string[] }, filterValue: string): string[] {
    console.log('cityIndex', cityIndex);
    filterValue = filterValue.trim().toLowerCase();
    console.log('filterValue', filterValue);
    let filteredCities: string[] = [];
    let isHebrewLetter: boolean = false; // Initialize with a default value
  
    if (this.selectedCity) {
      // If a city is selected, only consider cities starting with the selected letter
      const selectedLetter = this.selectedCity.charAt(0).toLowerCase();
  
      // Check if the typed letter is in Hebrew using a regular expression
      isHebrewLetter = /^[\u0590-\u05FF]+$/.test(filterValue);
  
      if (selectedLetter === filterValue[0] && isHebrewLetter) {
        // Filter and concatenate matching cities
        filteredCities = cityIndex[selectedLetter].filter((city) =>
          city.toLowerCase().includes(filterValue)
        );
      }
    }
  
    // If the input is in English, add a general option
    if (!filteredCities.length && !isHebrewLetter) {
      filteredCities.push('נא להקליד בעברית'); // Replace with the desired message or option
    }
  
    console.log('filteredCities', filteredCities);
    return filteredCities;
  }
  
  
  
  
  
  

  // private filterCities(
  //   cityIndex: { [letter: string]: string[] },
  //   filterValue: string
  // ): string[] {
  //   console.log('cityIndex', cityIndex);
  //   filterValue = filterValue.toLowerCase();
  //   console.log('filterValue', filterValue);
  //   let filteredCities: string[] = [];

  //   if (this.selectedCity) {
  //     // If a city is selected, only consider cities starting with the selected letter
  //     const selectedLetter = this.selectedCity.charAt(0).toLowerCase();
  //     if (selectedLetter === filterValue[0]) {
  //       // Filter and concatenate matching cities
  //       filteredCities = filteredCities.concat(
  //         cityIndex[selectedLetter].filter((city) =>
  //           city.toLowerCase().includes(filterValue)
  //         )
  //       );
  //     }
  //   }
  //   console.log('filteredCities', filteredCities);
  //   return filteredCities;
  // }

  toggleDisable() {
    this.streetFilterControl.enable();
    this.isDisable = !this.isDisable;
    this.streetFilterControl.setValue('');
  }

  searchApartments() {
    if (this.cityFilterControl.valid) {

      this.isValidSearch= true
    const searchData = {
      post_city: this.cityFilterControl.value as string,
      post_street: this.streetFilterControl.value as string,
      post_apartment_number:
        this.apartmentControl.value !== null
          ? this.apartmentControl.value
          : 'null',
      post_building_number:
        this.buildingControl.value !== null
          ? this.buildingControl.value
          : 'null',
    };

    this.loading = true;

    console.log('1111searchData111', searchData);
    

    this.router.navigate(['/apartment'], { queryParams: searchData });

   
  }
  }



  navigateToApartmentForm() {
    // console.log('clicked');
    this.router.navigate(['/rantal']);
  }

  navigateToPersonalInfo() {
    // console.log('clicked');
    this.router.navigate(['/personalInfo']);
  }

  setGreetingMessage(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (this.logedinUser && this.logedinUser.user_full_name) {
      const fullNameParts = this.logedinUser.user_full_name.split(' ');
      const firstName = fullNameParts[0]; 

      if (currentHour >= 5 && currentHour < 12) {
        this.greetingMessage = `בוקר טוב ${firstName}`;
      } else if (currentHour >= 12 && currentHour < 17) {
        this.greetingMessage = `צוהריים טובים ${firstName}`;
      } else if (currentHour >= 17 && currentHour < 20) {
        this.greetingMessage = `ערב טוב ${firstName}`;
      } else {
        this.greetingMessage = `לילה טוב ${firstName}`;
      }
    } else {
      this.greetingMessage = 'ברוכים הבאים';
    }

  console.log('this.greetingMessage',this.greetingMessage)
  }


  }

