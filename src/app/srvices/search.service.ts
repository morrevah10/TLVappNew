import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuery: string = '';

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  getSearchQuery() {
    return this.searchQuery;
  }
}
