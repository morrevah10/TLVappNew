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

  // private fake : any[][]=[];

  citySubject = new BehaviorSubject<string[]>([]);
  streetSubject = new BehaviorSubject<string[]>([]);

  private preprocessedCityDataSubject = new BehaviorSubject<{
    [letter: string]: string[];
  }>({});
  preprocessedCityData$ = this.preprocessedCityDataSubject.asObservable();

  //  fakeSubject = new BehaviorSubject<any[][]>([]);

  private cityIndex: { [letter: string]: string[] } = {};

  constructor(private http: HttpClient) {
    this.loadCitiesAndStreets();
    // this.loadFakeJson()
    // this.preprocessCities(this.cities)
  }

  // private loadFakeJson() {
  //   this.http.get('../../../assets/Jsons/fakePost.json').subscribe((data: any) => {
  //     this.fake = data.fakeJson;
  //     console.log('this.fake', this.fake);
  //     this.fakeSubject.next(this.fake);
  //   });
  // }

  private loadCitiesAndStreets() {
    this.http
      .get('../../../assets/Jsons/cities.json')
      .subscribe((data: any) => {
        this.cities = data.cities;
        this.citySubject.next(this.cities.map((city) => city.city_name));
        this.preprocessCities(this.cities);
      });

    this.http
      .get('../../../assets/Jsons/streets.json')
      .subscribe((data: any) => {
        this.streets = data.streets;
      });
  }

  getCities(): Observable<string[]> {
    return this.citySubject.asObservable();
  }

  getStreets(): Observable<string[]> {
    return this.streetSubject.asObservable();
  }

  updateStreetFilter(cityName: string | null, filter: string) {
    if (cityName) {
      const trimmedCity = cityName.trim().toLowerCase();

      // Filter streets based on a partial match to the city name
      const cityFilteredStreets = this.streets
        .filter((street) => street.city_name.toLowerCase().includes(trimmedCity))
        .map((street) => street.street_name);

      // Filter the city-filtered streets based on the user input filter
      const filteredStreets = cityFilteredStreets.filter((street) =>
        street.toLowerCase().startsWith(filter.toLowerCase())
      );

      // Emit the filtered streets to the streetSubject
      this.streetSubject.next(filteredStreets);
    }
  }


  // getStreetsByCity(cityName: string, filter: string) {
  //   // Filter streets based on the selected city
  //   const trimmedCity = cityName.trim().toLowerCase();
  //   const cityFilteredStreets = this.streets
  //     .filter((street) => street.city_name.toLowerCase().includes(trimmedCity))
  //     .map((street) => street.street_name);
  
  //   // Filter the city-filtered streets based on the user input filter
  //   const filteredStreets = cityFilteredStreets.filter((street) =>
  //     street.toLowerCase().startsWith(filter.toLowerCase())
  //   );
  
  //   // Sort the filtered streets
  //   const sortedStreets = filteredStreets.sort();
  
  //   // this.streetSubject.next(sortedStreets);
  // }



  updateCityFilter(filter: string) {
    const filteredCities = this.cities
      .filter((city) =>
        city.city_name.toLowerCase().startsWith(filter.toLowerCase())
      )
      .map((city) => city.city_name);
    // console.log(' filteredCities', filteredCities)
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
  // updateStreetFilter(cityName: string | null, filter: string) {
  //   if (cityName) {
  //     // console.log('Updating Street Filter - Selected City:', cityName);
  //     const trimmedCity = cityName.trim().toLowerCase();

  //     // Filter streets based on a partial match to the city name
  //     const cityFilteredStreets = this.streets
  //       .filter((street) =>
  //         street.city_name.toLowerCase().includes(trimmedCity)
  //       )
  //       .map((street) => street.street_name);

  //     // Filter the city-filtered streets based on the user input filter
  //     const filteredStreets = cityFilteredStreets.filter((street) =>
  //       street.toLowerCase().startsWith(filter.toLowerCase())
  //     );

  //     // console.log('Filtered Streets:', filteredStreets);
  //     // console.log('Emitting to streetSubject:', filteredStreets);
  //     this.streetSubject.next(filteredStreets);
  //   }
  // }

  private preprocessCities(citiesData: any[]) {
  // console.log('citiesData',citiesData)
    const cityIndex: { [letter: string]: string[] } = {};

    citiesData.forEach((city) => {
      const firstLetter = city.city_name.charAt(0).toLowerCase();
      if (!cityIndex[firstLetter]) {
        cityIndex[firstLetter] = [];
      }
      cityIndex[firstLetter].push(city.city_name);
    });

    // Sort the cities by letters
    Object.keys(cityIndex).forEach((key) => {
      cityIndex[key] = cityIndex[key].sort();
    });

    this.preprocessedCityDataSubject.next(cityIndex);
    // console.log('this.preprocessedCityDataSubject',this.preprocessedCityDataSubject)
  }
}
