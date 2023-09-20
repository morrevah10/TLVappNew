import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
// import {json} from '../../assets/Jsons/fakePost.json'

@Injectable({
  providedIn: 'root',
})
export class DataService {
    private cities: any[] = [];
    private streets: any[] = [];

    private fake : any[][]=[];
  
     citySubject = new BehaviorSubject<string[]>([]);
     streetSubject = new BehaviorSubject<string[]>([]);

     fakeSubject = new BehaviorSubject<any[][]>([]);

     
  
    constructor(private http: HttpClient) {
      this.loadCitiesAndStreets();
      this.loadFakeJson()
    }

    private loadFakeJson() {
      this.http.get('../../../assets/Jsons/fakePost.json').subscribe((data: any) => {
          this.fake = data.fakeJson;
          console.log('this.fake',this.fake)
        this.fakeSubject.next(this.fake);
      });
    }
  
    private loadCitiesAndStreets() {
      this.http.get('../../../assets/Jsons/cities.json').subscribe((data: any) => {
          this.cities = data.cities;
          console.log('this.cities',this.cities)
        this.citySubject.next(this.cities.map((city) => city.city_name));
      });
  
      this.http.get('../../../assets/Jsons/streets.json').subscribe((data: any) => {
          this.streets = data.streets;
          console.log(' this.streets', this.streets)
      });
    }
  
    getCities(): Observable<string[]> {
      return this.citySubject.asObservable();
    }
  
    getStreets(): Observable<string[]> {
      return this.streetSubject.asObservable();
    }

    getJson() : Observable<any[][]> {
      console.log('this.fakeSubject',this.fakeSubject)
      return this.fakeSubject;
    }
  
    updateCityFilter(filter: string) {
      const filteredCities = this.cities
        .filter((city) => city.city_name.toLowerCase().startsWith(filter.toLowerCase()))
        .map((city) => city.city_name);
        console.log(' filteredCities', filteredCities)
      this.citySubject.next(filteredCities);
    }
  
//! only by city and work!
// updateStreetFilter(cityName: string | null, filter: string) {
//     if (cityName) {
//       console.log('Updating Street Filter - Selected City:', cityName);
//       const trimmedCity = cityName.trim().toLowerCase();
      
//       // Filter streets based on a partial match to the city name
//       const filteredStreets = this.streets
//         .filter((street) =>
//           street.city_name.toLowerCase().includes(trimmedCity)
//         )
//         .map((street) => street.street_name);
  
//       console.log('Filtered Streets:', filteredStreets);
//     }
//   }
  
//!  city and  input 
updateStreetFilter(cityName: string | null, filter: string) {
    if (cityName) {
      console.log('Updating Street Filter - Selected City:', cityName);
      const trimmedCity = cityName.trim().toLowerCase();
  
      // Filter streets based on a partial match to the city name
      const cityFilteredStreets = this.streets
        .filter((street) =>
          street.city_name.toLowerCase().includes(trimmedCity)
        )
        .map((street) => street.street_name);
  
      // Filter the city-filtered streets based on the user input filter
      const filteredStreets = cityFilteredStreets
        .filter((street) =>
          street.toLowerCase().startsWith(filter.toLowerCase())
        );
  
      console.log('Filtered Streets:', filteredStreets);
      console.log('Emitting to streetSubject:', filteredStreets);
      this.streetSubject.next(filteredStreets);
    }
    
  }
  


}