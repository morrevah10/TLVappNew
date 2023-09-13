import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/srvices/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { SearchService } from 'src/app/srvices/search.service';
import { FormsModule } from '@angular/forms';
import { PostService } from 'src/app/srvices/post.service';
import { ApartmentListComponent } from 'src/app/cmps/apartment/apartment-list/apartment-list.component';
import { HttpClient } from '@angular/common/http';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map,mergeMap, switchMap } from 'rxjs/operators';

interface CityData {
  city_name: string;
  streets: string[];
}
interface StreetsData {
  streetByCity: CityData[];
}


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

  selectedCity: string = '';

  cityControl = new FormControl();
  filteredCities!: Observable<any[]>;
  cities: any[] = [];

  streetControl = new FormControl();
  filteredStreets!: Observable<any[]>;
  streets: any[] = [];

  apartmentControl = new FormControl();
  buildingControl = new FormControl();
  cityData: string[] = [];

  errorMessage='';
  
  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    private postservice: PostService,
    private http: HttpClient
  ) {
    this.filteredCities = this.cityControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCities(value))
    );

    this.filteredStreets = this.streetControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStreets(value))
    );



    
    
  }

  

  private _filterCities(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.cities
      ? this.cities.filter(
          (city: { city_name: string; city_name_en: string }) =>
            city.city_name.startsWith(filterValue) ||
            city.city_name_en.startsWith(filterValue)
        )
      : [];
  }


  private _filterStreets(value: string): string[] {
    // console.log(value,'valueeeeeee')
    // console.log(this.selectedCity,'this.selectedCity')
    const filterValue = value.toLowerCase();
    // console.log('this.streets',this.streets)
    // console.log('cityData',this.cityData)
    const filteredStreets = this.cityData
    .filter(street => street.toLowerCase().includes(filterValue))
    .filter(street => street.toLowerCase().startsWith(filterValue));
  // console.log(filteredStreets, 'Filtered streets');
  return filteredStreets;
}



  
  
  

  

  ngOnInit() {
    console.log('HomeComponent initialized');
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.logedinUser = user;
      this.cdr.detectChanges();
    });

    this.http
      .get<any>('../../../assets/Jsons/cities.json')
      .subscribe((data) => {
        this.cities = data.cities;
        // console.log('this.cities',this.cities)
      });

      this.http
      .get<StreetsData>('../../../assets/Jsons/streets_by_city.json')
      .subscribe((data) => {
        this.streets = data.streetByCity;
        // console.log('data.streets', data.streetByCity);
        // console.log('this.streets', this.streets);
      });


      this.cityControl.valueChanges.subscribe((selectedCity) => {
        this.selectedCity = selectedCity;
        const streets = this.getStreetsForCity(selectedCity);
        // console.log('streets !!!!!',streets)
        if (streets) {
          this.streetControl.setValue(''); // Clear the street input when a new city is selected
          this.filteredStreets = of(streets);
          // console.log('this.filteredStreets',this.filteredStreets)
        } else {
          this.filteredStreets = of([]); // Clear the street options if no streets available for the city
        }
      });
      
      this.streetControl.valueChanges.subscribe((streetSearchValue) => {
        const filteredStreets = this._filterStreets(streetSearchValue);
        this.filteredStreets = of(filteredStreets); // Wrap filtered array in an observable using 'of()'
      });
      
  }



  
  onCityOptionSelected(cityName: string) {
    // console.log('cityName',cityName)
    this.selectedCity = cityName;
    // console.log(this.selectedCity,'this.selectedCity')
    this.streetControl.setValue(''); // Clear the street input when a new city is selected
  }
  
  
  
  getStreetsForCity(selectedCity: string): string[] | undefined {

    // console.log('selectedCity',selectedCity)
    // console.log('this.streets',this.streets)

    const cityData = this.streets.find((obj) => obj.city_name.trim() == selectedCity.trim());
    // console.log('cityData',cityData)
    // console.log('cityData?.streets',cityData.streets)
    this.cityData = cityData?.streets
    // console.log('this.cityData',this.cityData)
    return cityData?.streets;
  }
  
  

  
  getDisplayCityName(city: {
    city_name: string;
    city_name_en: string;
  }): string {
    const inputLanguage = this.detectInputLanguage(this.cityControl.value);
    return inputLanguage === 'en' ? city.city_name_en : city.city_name;
  }



  detectInputLanguage(input: string): string {
    if (input.match(/[a-zA-Z]/)) {
      return 'en';
    } else {
      return 'he';
    }
  }

  searchApartments() {
    const searchData = {
      post_city:this.selectedCity,
      post_street:this.streetControl.value,
      post_apartment_number: this.apartmentControl.value,
      post_building_number : this.buildingControl.value
    }
    console.log('1111searchData111',searchData)
    this.searchService.setSearchData(searchData);
    
    // this.apartmentList.fetchApartmentsFiltered(searchData)
    
    this.apartmentList.fetchApartmentsFiltered(searchData).subscribe(
      (apartments) => {
        console.log('Fetched apartments:', apartments);
        this.apartmentList.apartments = apartments;

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
    console.log('clicked');
    this.router.navigate(['/personalInfo']);
  }
}


