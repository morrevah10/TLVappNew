import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/srvices/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { SearchService } from 'src/app/srvices/search.service';
import { FormsModule } from '@angular/forms';
import { PostService } from 'src/app/srvices/post.service';
import { ApartmentListComponent } from 'src/app/cmps/apartment/apartment-list/apartment-list.component';
import { HttpClient } from '@angular/common/http';

import { MatAutocomplete } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { DataService } from 'src/app/srvices/data.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(ApartmentListComponent) apartmentList!: ApartmentListComponent;

  logedinUser: User | null = null;
  search = {
    post_city: '',
    post_street: '',
    post_apartment_number: '',
    post_bulding_number:'',
  };

 
  apartmentControl = new FormControl();
  buildingControl = new FormControl();
  errorMessage='';
  




  cityFilterControl = new FormControl();
  streetFilterControl = new FormControl({ value: '', disabled: true });

  filteredCities$!: Observable<string[]>;
  filteredStreets$!: Observable<string[]>;

  selectedCity: string  = '';
  filteredStreets: string[] = [];

  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;
  loading: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    private postservice: PostService,
    private dataService: DataService,
    private http: HttpClient
  ) {
    
  }


  ngOnInit() {
    console.log('HomeComponent initialized');
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.logedinUser = user;
      this.cdr.detectChanges();
    });

    this.filteredCities$ = this.dataService.getCities();
    this.filteredStreets$ = this.dataService.streetSubject.asObservable();
    this.cityFilterControl.valueChanges.subscribe((filterValue) => {
      this.dataService.updateCityFilter(filterValue);
    });

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

    console.log('Subscribing to filteredStreets$');
    this.dataService.streetSubject.asObservable().subscribe((streets) => {
      this.filteredStreets = streets;
      console.log('Filtered Streets:', this.filteredStreets);
    });

  }

  searchApartments() {
    const searchData = {
      post_city:this.cityFilterControl.value as string,
      post_street:this.streetFilterControl.value as string,
      post_apartment_number: this.apartmentControl.value,
      post_building_number : this.buildingControl.value
    }

    this.loading = true;

    console.log('1111searchData111',searchData)
    this.searchService.setSearchData(searchData);
        
    this.apartmentList.fetchApartmentsFiltered(searchData).subscribe(
      (apartments) => {
        console.log('Fetched apartments:', apartments);
        setTimeout(() => {
          this.loading = false;
          this.apartmentList.apartments = apartments;
        }, 5000);
      },
      (error) => {
        console.log('Error fetching apartment posts:', error);
        this.errorMessage = 'An error occurred while fetching apartments :'+ error ;
      }
    );

  }

  navigateToApartmentForm() {
    // console.log('clicked');
    this.router.navigate(['/rantal']);
  }

  navigateToPersonalInfo() {
    // console.log('clicked');
    this.router.navigate(['/personalInfo']);
  }
}


