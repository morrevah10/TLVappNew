import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostService } from './post.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchQuery: any = {
    city: '',
    street: '',
    apartmentNumber: '',
  };

  private api_url = 'https://data.gov.il/api/3/action/datastore_search';
  private cities_resource_id = '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba';
  private streets_resource_id = 'a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3';
  private city_name_key = 'town_name';
  private street_name_key = 'street_name';
  private cities_data_id = 'cities-data';
  private streets_data_id = 'streets-data';

  constructor(private http: HttpClient, private postservice: PostService) {}

  // private searchQuerySubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    // {}
  // );
  // public searchQuery$: Observable<any> = this.searchQuerySubject.asObservable();

  private searchQuerySubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  public searchQuery$: Observable<any> = this.searchQuerySubject.asObservable();

  setSearchQuery(query: any) {
    this.searchQuerySubject.next(query);
    console.log('query', query);
  }
}

// setSearchQuery(query: any) {
//   this.searchQuery = query;
//   console.log('this.searchQuery',this.searchQuery)
// }

// getSearchQuery() {
//   return this.searchQuery;
// }

// }
// getCitiesSuggestions(): Observable<string[]> {
//   const query = `SELECT DISTINCT ${this.city_name_key} FROM "${this.cities_resource_id}"`;
//   return this.getSuggestions(this.cities_data_id, query);
// }

// getStreetsSuggestions(city: string): Observable<string[]> {
//   const query = `SELECT DISTINCT ${this.street_name_key} FROM "${this.streets_resource_id}" WHERE ${this.city_name_key} = '${city}'`;
//   return this.getSuggestions(this.streets_data_id, query);
// }

// private getSuggestions(resource_id: string, q: string): Observable<string[]> {
//   const limit = "100";
//   return this.http.get<any>(this.api_url, { params: { resource_id, q, limit } })
//     .pipe(
//       map(response => response?.result?.records.map((record: { [x: string]: string; }) => record[Object.keys(record)[0]].trim()))
//     );
// }
