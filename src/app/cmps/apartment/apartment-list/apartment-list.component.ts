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
import { ResponsesService } from 'src/app/srvices/responses.service';

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

  
  isApartmentsReady: boolean = false;

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
    private route: ActivatedRoute,
    private responsesService:ResponsesService
  ) {}



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
      console.log('searchParams', searchParams);
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



  viewApartmentDetails(apartmentId: number) {
    this.router.navigate(['/apartment', apartmentId]);
  }

  fetchApartmentsFiltered(searchParams: any) {
    this.postService.getApartmentFilteredPosts(searchParams).subscribe(
      (response: any) => {
        console.log(response);
        const cleanedResponse = response.replace(/^\{+|\}+$/g, '');
        console.log(cleanedResponse);
        const arrayOfArrays = JSON.parse(cleanedResponse);
        // console.log(arrayOfArrays);
        // this.filteredApartments = arrayOfArrays;
        this.filteredApartments = arrayOfArrays.map((subArray: any[]) =>
          subArray.map((item, subindex) => ({ ...item, subindex }))
        );
        this.isApartmentsReady = true;
        console.log(this.filteredApartments);
      },
      (error: any) => {
        console.error('Error fetching apartment posts:', error);
        this.isApartmentsReady = true;
        // Handle the error if necessary
      }
    );
  }


  updateCurrentIndex(subArrayIndex: number, newIndex: number) {
    this.currentIndexMap[subArrayIndex] = newIndex;
  }

  getCurrentIndex(subArrayIndex: number): number {
    return this.currentIndexMap[subArrayIndex] || 0;
  }
}
