import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/srvices/post.service';
import { SearchService } from 'src/app/srvices/search.service';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';



@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss'],
})
export class ApartmentListComponent implements OnInit {
  @Input() apartments!: any[];
  // apartments: any[] = [];
  afterSearchApartments: any[] = [];
  filteredApartments: any[] = [];
  errorMessage=''

  constructor(
    private postService: PostService,
    private router: Router,
    private searchService: SearchService,
    private dialog: MatDialog,

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

  // fetchApartmentsFiltered(searchData: { post_city: string; post_street: string; post_apartment_number: string; }) {
  //   this.postService.getApartmentFilteredPosts(searchData).subscribe(
  //     (apartments) => {
  //       this.apartments = apartments;
  //       console.log('this.afterSearchApartments:', this.afterSearchApartments);
  //     },
  //     (error) => {
  //       console.error('Error fetching apartment posts:', error);
  //     }
  //   );
  // }



  fetchApartmentsFiltered(searchData: { post_city: string; post_street: string; post_apartment_number: string; }): Observable<any> {
    return this.postService.getApartmentFilteredPosts(searchData).pipe(
      catchError((error) => {
        console.error('Error fetching apartment posts:', error);
        // You can show the error to the user here, for example, by displaying a message.
        // You can also re-throw the error if you want to handle it further up the chain.
        return throwError(error.error); // Re-throwing the error
        // return EMPTY; // Return an empty observable or handle the error as needed
      })
    );
 }




  viewApartmentDetails(apartmentId: number) {
    this.router.navigate(['/apartment', apartmentId]);
  }


}
