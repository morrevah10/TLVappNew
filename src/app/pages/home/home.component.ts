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

  logedinUser: User | null = null;
  search = {
    post_city: '',
    post_street: '',
    post_apartment_number: '',
    post_bulding_number: '',
  };

  apartmentControl = new FormControl();
  buildingControl = new FormControl();
  errorMessage = '';

  cityFilterControl = new FormControl();
  streetFilterControl = new FormControl({ value: '', disabled: true });

  filteredCities$!: Observable<string[]>;
  filteredStreets$!: Observable<string[]>;

  selectedCity: string = '';
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
  ) {}

  ngOnInit() {
    console.log('HomeComponent initialized');
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.logedinUser = user;
      this.cdr.detectChanges();
    });


    this.dataService.getFakeData().subscribe((data) => {
      this.fakeData = data;
      console.log('fakeData', this.fakeData);
    });



    this.filteredCities$ = this.dataService.getCities();
    this.filteredStreets$ = this.dataService.streetSubject.asObservable();
    this.cityFilterControl.valueChanges.subscribe((filterValue) => {
      this.dataService.updateCityFilter(filterValue);
    });

    this.cityFilterControl.valueChanges.subscribe((selectedCity) => {
      // console.log('Selected City:', selectedCity);
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
      // console.log('Filtered Streets:', this.filteredStreets);
    });
  }

  // searchApartments() {
  //   const searchData = {
  //     post_city:this.cityFilterControl.value as string,
  //     post_street:this.streetFilterControl.value as string,
  //     post_apartment_number: this.apartmentControl.value,
  //     post_building_number : this.buildingControl.value
  //   }

  //   this.loading = true;

  //   console.log('1111searchData111',searchData)
  //   this.searchService.setSearchData(searchData);

  //   this.apartmentList.fetchApartmentsFiltered(searchData).subscribe(
  //     (apartments) => {
  //       console.log('Fetched apartments:', apartments);
  //       setTimeout(() => {
  //         this.loading = false;
  //         this.apartmentList.apartments = apartments;
  //       }, 5000);
  //     },
  //     (error) => {
  //       console.log('Error fetching apartment posts:', error);
  //       this.errorMessage = 'An error occurred while fetching apartments :'+ error ;
  //     }
  //   );
  // }



  searchApartments() {
    const searchData = {
      post_city: this.cityFilterControl.value as string,
      post_street: this.streetFilterControl.value as string,
      post_apartment_number: this.apartmentControl.value,
      post_building_number: this.buildingControl.value,
    };
  
    this.loading = true;
  
    console.log('1111searchData111', searchData);
    this.searchService.setSearchData(searchData);
  
    this.apartmentList.fetchApartmentsFiltered(searchData).subscribe(
      (apartmentsResponse) => {
        // Remove the outer curly braces to make it valid JSON
        const cleanedResponse = apartmentsResponse.replace(/^\{+|\}+$/g, '');
  
        // Parse the cleaned response as JSON
        let apartmentsObject = null;
        try {
          apartmentsObject = JSON.parse(cleanedResponse);
        } catch (error) {
          console.error('Error parsing response as JSON:', error);
        }
  
        console.log('Fגטאלכיחעץ:', apartmentsObject);
  
        // Extract the arrays directly from the object
        const extractedArrays = Object.values(apartmentsObject);
        console.log('Extracted arrays:', extractedArrays);
  
        // Update the apartmentList with the extracted arrays
        this.apartmentList.apartments = extractedArrays as any[][];
  
        setTimeout(() => {
          this.loading = false;
        }, 5000);
      },
      (error) => {
        console.log('Error fetching apartment posts:', error);
        this.errorMessage =
          'An error occurred while fetching apartments :' + error;
      }
    );
  }
  



  // searchApartments() {
  //   const searchData = {
  //     post_city: this.cityFilterControl.value as string,
  //     post_street: this.streetFilterControl.value as string,
  //     post_apartment_number: this.apartmentControl.value,
  //     post_building_number: this.buildingControl.value,
  //   };

  //   this.loading = true;

  //   console.log('1111searchData111', searchData);
  //   this.searchService.setSearchData(searchData);

  //   this.apartmentList.fetchApartmentsFiltered(searchData).subscribe(
  //     (apartments) => {
  //       console.log('Fetched apartments:', apartments);

  //       // const extractedArray = apartments;
  //       // const extractedArray = Array.isArray(apartments) ? apartments[0] : [];


        
  //       // console.log('Fetched 2 apartments:', extractedArray);
  //       //! Group the apartments based on your criteria
  //       // const groupedApartments = this.groupApartments(apartments);
  //       // console.log('groupedApartments',groupedApartments)
  //       // console.log(' this.apartmentList', this.apartmentList)
  //       // this.apartmentList.apartments = extractedArray as any[][];
  //       this.apartmentList.apartments = apartments;
  //       console.log(' this.apartmentList', this.apartmentList.apartments)

  //       setTimeout(() => {
  //         this.loading = false;
  //         // this.apartmentList.apartments = groupedApartments;
  //         // this.apartmentList.apartments = this.fakeData;
  //       }, 5000);
  //     },
  //     (error) => {
  //       console.log('Error fetching apartment posts:', error);
  //       this.errorMessage =
  //         'An error occurred while fetching apartments :' + error;
  //     }
  //   );
  // }

  // groupApartments(apartments: Apartment[]): Apartment[][] {
  //   const groupedApartments: Apartment[][] = [];

  //   // Create a map to group apartments by city, street, building, and apartment number
  //   const apartmentMap = new Map<string, Apartment[]>();

  //   apartments.forEach((apartment) => {
  //     const key = `${apartment.post_city}-${apartment.post_street}-${apartment.post_building_number}-${apartment.post_apartment_number}`;

  //     if (!apartmentMap.has(key)) {
  //       apartmentMap.set(key, []);
  //     }

  //     apartmentMap.get(key)?.push(apartment);
  //   });

  //   // Extract the grouped apartments into an array of arrays
  //   apartmentMap.forEach((group) => {
  //     groupedApartments.push(group);
  //   });

  //   return groupedApartments;
  // }

  navigateToApartmentForm() {
    // console.log('clicked');
    this.router.navigate(['/rantal']);
  }

  navigateToPersonalInfo() {
    // console.log('clicked');
    this.router.navigate(['/personalInfo']);
  }
}


