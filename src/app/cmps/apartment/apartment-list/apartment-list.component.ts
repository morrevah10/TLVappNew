import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/srvices/post.service';
import { SearchService } from 'src/app/srvices/search.service';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CarouselComponent, CarouselConfig } from 'ngx-bootstrap/carousel';
import { AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { format } from 'date-fns';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss'],
  providers: [{ provide: CarouselConfig, useValue: { isAnimated: false } }],
})
export class ApartmentListComponent implements OnInit {
  @Input() apartments: any[][] = [];
  activeSlide: number = 0;

  group!: any[];
  currentIndex = 0;
  currentIndexMap: { [key: number]: number } = {};
  subindex = 0;

  

  currentSlide = 0;
  carouselStyles: string[] = [];

  filteredApartments: any[] = [];
  errorMessage = '';
  searchParams: string = '';


  initialPostsToShow = 3; // Number of posts to show initially
  postsToShow = this.initialPostsToShow; // Number of posts to display
  postsToLoad = 3; // Number of additional posts to load

  constructor(
    private postService: PostService,
    private router: Router,
    private searchService: SearchService,
    private dialog: MatDialog,
    private el: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute
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

  // ngOnInit() {
  //   this.searchService.searchData$.subscribe(searchParams => {
  //     console.log('searchParams',searchParams)
  //   });

  //   for (let i = 0; i < this.apartments.length; i++) {
  //     const style = this.renderer.createElement('style');
  //     style.innerHTML = `::ng-deep #carousel${i + 1}.carousel.slide {
  //       max-width: 300px;
  //       /* Add other individual styles here */
  //     }`;
  //     this.renderer.appendChild(this.el.nativeElement, style);
  //   }
  // }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // console.log('params', params);

      const searchParams = {
        post_city: params['post_city'] || '',
        post_street: params['post_street'] || '',
        post_apartment_number:
          params['post_apartment_number'] !== 'null'
            ? params['post_apartment_number']
            : '',
        post_building_number:
          params['post_building_number'] !== 'null'
            ? params['post_building_number']
            : '',
      };
      // console.log('searchParams', searchParams);
      if (searchParams.post_city != undefined) {
        this.fetchApartmentsFiltered(searchParams);
      }
      this.searchParams =
      searchParams.post_city +','
      searchParams.post_street +','
      searchParams.post_building_number +','
      searchParams.post_apartment_number;
    });

  }
  loadMorePosts() {
    this.postsToShow += this.postsToLoad;
  }
  // nextSlide() {
  //   this.currentSlide = (this.currentSlide + 1) % this.apartments.length;
  // }

  // prevSlide() {
  //   this.currentSlide =
  //     (this.currentSlide - 1 + this.apartments.length) % this.apartments.length;
  // }
  prevSlide(subArray: any[]) {
    if (this.subindex > 0) {
      this.currentIndex--;
    }
  }

  nextSlide(subArray: any[]) {
    if (this.subindex < subArray.length - 1) {
      this.subindex++;
    }
  }

  //   fetchApartmentsFiltered(searchData: { post_city: string; post_street: string; post_apartment_number: string; post_building_number:string; }): Observable<any> {
  //     return this.postService.getApartmentFilteredPosts(searchData).pipe(
  //       catchError((error) => {
  //         console.error('Error fetching apartment posts:', error);
  //         // You can show the error to the user here, for example, by displaying a message.
  //         // You can also re-throw the error if you want to handle it further up the chain.
  //         return throwError(error.error); // Re-throwing the error
  //         // return EMPTY; // Return an empty observable or handle the error as needed
  //       })
  //     );

  //  }
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
  // fetchApartments() {
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

  //   fetchApartmentsFiltered(searchData: { post_city: string; post_street: string; post_apartment_number: string; post_building_number:string; }): Observable<any> {
  //     return this.postService.getApartmentFilteredPosts(searchData).pipe(
  //       catchError((error) => {
  //         console.error('Error fetching apartment posts:', error);
  //         // You can show the error to the user here, for example, by displaying a message.
  //         // You can also re-throw the error if you want to handle it further up the chain.
  //         return throwError(error.error); // Re-throwing the error
  //         // return EMPTY; // Return an empty observable or handle the error as needed
  //       })
  //     );

  //  }

  //  prevSlide() {
  //   if (this.activeSlide > 0) {
  //     this.activeSlide--;
  //   }
  // }

  // nextSlide() {
  //   if (this.activeSlide < this.apartments.length - 1) {
  //     this.activeSlide++;
  //   }
  // }

  viewApartmentDetails(apartmentId: number) {
    this.router.navigate(['/apartment', apartmentId]);
  }

  fetchApartmentsFiltered(searchParams: any) {
    this.postService.getApartmentFilteredPosts(searchParams).subscribe(
      (response: any) => {
        // console.log(response);
        const cleanedResponse = response.replace(/^\{+|\}+$/g, '');
        // console.log(cleanedResponse);
        const arrayOfArrays = JSON.parse(cleanedResponse);
        // console.log(arrayOfArrays);
        // this.filteredApartments = arrayOfArrays;
        this.filteredApartments = arrayOfArrays.map((subArray: any[]) =>
          subArray.map((item, subindex) => ({ ...item, subindex }))
        );
        // console.log(this.filteredApartments);
      },
      (error: any) => {
        console.error('Error fetching apartment posts:', error);
        // Handle the error if necessary
      }
    );
  }

  // isCarousel(group: any[]): boolean {
  //   return group.length > 1;
  // }

  // private flattenResponse(response: any[]) {
  //   const flattenedApartments: any[] = [];

  //   // Loop through the nested arrays and flatten them
  //   response.forEach((nestedArray) => {
  //     if (Array.isArray(nestedArray)) {
  //       flattenedApartments.push(...nestedArray);
  //     } else {
  //       flattenedApartments.push(nestedArray);
  //     }
  //   });

  //   // Assign the flattened data to the component property
  //   this.filteredApartments = flattenedApartments;
  //   console.log('Filtered Apartments:', this.filteredApartments);
  // }

  updateCurrentIndex(subArrayIndex: number, newIndex: number) {
    this.currentIndexMap[subArrayIndex] = newIndex;
  }

  getCurrentIndex(subArrayIndex: number): number {
    return this.currentIndexMap[subArrayIndex] || 0;
  }
}
