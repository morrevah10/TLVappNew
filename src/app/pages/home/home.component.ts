import { Component, OnInit ,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/srvices/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { SearchService } from 'src/app/srvices/search.service';
import { FormsModule } from '@angular/forms'; 
import { PostService } from 'src/app/srvices/post.service';
import { ApartmentListComponent } from 'src/app/cmps/apartment/apartment-list/apartment-list.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(ApartmentListComponent) apartmentList!: ApartmentListComponent;

  logedinUser: User | null = null;
  search = {
    post_city: '',
    post_street: '',
    post_apartment_number: ''
  };
  citySuggestions: string[] = [];
  streetSuggestions: string[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    private postservice : PostService,
  ) {}

  ngOnInit() {
    console.log('HomeComponent initialized');
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.logedinUser = user;
      this.cdr.detectChanges();
    });
    // this.updateCitySuggestions();
  }
  searchApartments() {
    this.searchService.setSearchQuery(this.search);
    this.apartmentList.fetchApartments(this.search);
  }

  // searchApartments() {
  //   this.searchService.setSearchQuery(this.search);
  //   this.postservice.getApartmentPosts(this.search)

  // }

// searchApartments() {
//   this.searchService.setSearchQuery(this.search);
//   this.fetchApartments(this.search);
// }

  navigateToApartmentForm() {
    // console.log('clicked');
    this.router.navigate(['/rantal']);
  }

  navigateToPersonalInfo() {
    console.log('clicked');
    this.router.navigate(['/personalInfo']);
  }
  // updateCitySuggestions() {
  //   this.searchService.getCitiesSuggestions().subscribe(suggestions => {
  //     this.citySuggestions = suggestions;
  //   });
  // }

  // updateStreetSuggestions() {
  //   this.searchService.getStreetsSuggestions(this.search.city).subscribe(suggestions => {
  //     this.streetSuggestions = suggestions;
  //   });
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
}
