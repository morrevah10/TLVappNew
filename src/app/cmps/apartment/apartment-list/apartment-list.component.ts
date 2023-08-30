import { HttpErrorResponse } from '@angular/common/http';
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
  afterSearchApartments: any[] = [];
  filteredApartments: any[] = [];

  constructor(
    private postService: PostService,
    private router: Router,
    private searchService: SearchService
  ) {}

  // ngOnInit() {
  //   this.postService.getApartmentPosts().subscribe(
  //     (apartments) => {
  //       this.apartments = apartments;
  //       console.log('apartments:', apartments);
  //     },
  //     (error) => {
  //       console.error('Error fetching apartment posts:', error);
  //     }
  //   );
  // }
  // ngOnInit() {
  //   this.fetchApartments(); // Fetch apartments when the component initializes
  // }
  ngOnInit() {
    this.searchService.searchData$.subscribe(searchParams => {
      console.log('searchParams',searchParams)
      // this.fetchApartments(); 
      //#אם נחזיר את זה אז נראה את כל הפוסטים בדף הבית איך שהוא מעולה
    });
  }



  // fetchApartments(searchParams?: any) {
  //   console.log('searchParams',searchParams)
  //   this.postService.getApartmentPosts(searchParams).subscribe(
  //     (apartments) => {
  //       this.apartments = apartments;
  //       console.log('apartments:', apartments);
  //     },
  //     (error) => {
  //       console.error('Error fetching apartment posts:', error);
  //     }
  //   );
  // }
  fetchApartments() {
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

  fetchApartmentsFiltered(searchData: { post_city: string; post_street: string; post_apartment_number: string; }) {
    this.postService.getApartmentFilteredPosts(searchData).subscribe(
      (apartments) => {
        this.apartments = apartments;
        console.log('this.afterSearchApartments:', this.afterSearchApartments);
      },
      (error) => {
        console.error('Error fetching apartment posts:', error);
      }
    );
  }

  // fetchApartmentsFiltered(searchData: { post_city: string; post_street: string; post_apartment_number: string; }) {
  //   this.postService.getApartmentFilteredPosts(searchData).subscribe(
  //     (apartments) => {
  //       this.afterSearchApartments = apartments;
  //       console.log('this.afterSearchApartments:', this.afterSearchApartments);
  //     },
  //     (error) => {
  //       console.error('Error fetching apartment posts:', error);
  //     }
  //   );
  // }

 
  
  // fetchApartments(searchParams?: any) {
  //   this.postService.getApartmentPosts(searchParams).subscribe(
  //     (apartments) => {
  //       this.apartments = apartments;
  //       console.log('apartments:', apartments);
  //     },
  //     (error) => {
  //       console.error('Error fetching apartment posts:', error);
  //     }
  //   );
  // }






  // applyFilter() {
  //   const searchQuery = this.searchService.getSearchQuery();
  //   if (searchQuery) {
  //     this.filteredApartments = this.apartments.filter(apartment =>
  //       this.filterApartment(apartment, searchQuery)
  //     );
  //   } else {
  //     this.filteredApartments = this.apartments;
  //   }
  // }

  // filterApartment(apartment: any, searchQuery: string): boolean {
  //   if (!searchQuery) {
  //     return true; 
  //   }
  //   const normalizedSearch = searchQuery.toLowerCase();

  //   return (
  //   apartment.post_city.toLowerCase().includes(normalizedSearch) ||
  //   apartment.post_street.toLowerCase().includes(normalizedSearch) ||
  //   apartment.post_apartment_number.toLowerCase().includes(normalizedSearch)
   
  // );
  // }


  viewApartmentDetails(apartmentId: number) {
    this.router.navigate(['/apartment', apartmentId]);
  }


}
