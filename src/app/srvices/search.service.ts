import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostService } from './post.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  // searchData: any = {
  //   city: '',
  //   street: '',
  //   apartmentNumber: '',
  // };

  constructor(private http: HttpClient, private postservice: PostService) {}

  private searchDataSubject = new BehaviorSubject<any>(null);
  searchData$ = this.searchDataSubject.asObservable();

  setSearchData(searchData: any) {
    this.searchDataSubject.next(searchData);
    console.log('searchData from search service', searchData);
  }
}
