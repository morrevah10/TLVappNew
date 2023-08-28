import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/srvices/post.service';
import { SearchService } from 'src/app/srvices/search.service';
@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss'],
})
export class ApartmentListComponent implements OnInit {
  apartments: any[] = [];
  filteredApartments: any[] = [];

  constructor(
    private postService: PostService,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.postService.getApartmentPosts().subscribe(
      (apartments) => {
        this.apartments = apartments;
        console.log('apartments:', apartments);
      },
      (error) => {
        console.error('Error fetching apartment posts:', error);
      }
    );
  }


  applyFilter() {
    const searchQuery = this.searchService.getSearchQuery();
    if (searchQuery) {
      this.filteredApartments = this.apartments.filter(apartment =>
        this.filterApartment(apartment, searchQuery)
      );
    } else {
      this.filteredApartments = this.apartments;
    }
  }

  filterApartment(apartment: any, searchQuery: string): boolean {
    if (!searchQuery) {
      return true; 
    }
    const normalizedSearch = searchQuery.toLowerCase();

    return (
    apartment.post_city.toLowerCase().includes(normalizedSearch) ||
    apartment.post_street.toLowerCase().includes(normalizedSearch) ||
    apartment.post_apartment_number.toLowerCase().includes(normalizedSearch)
   
  );
  }


  viewApartmentDetails(apartmentId: number) {
    this.router.navigate(['/apartment', apartmentId]);
  }


}
