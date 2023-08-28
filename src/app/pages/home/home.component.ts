import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/srvices/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { SearchService } from 'src/app/srvices/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  logedinUser: User | null = null;
  searchQuery: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    console.log('HomeComponent initialized');
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.logedinUser = user;
      this.cdr.detectChanges();
    });
  }

  searchApartments() {
    this.searchService.setSearchQuery(this.searchQuery);
  }

  navigateToApartmentForm() {
    // console.log('clicked');
    this.router.navigate(['/rantal']);
  }

  navigateToPersonalInfo() {
    console.log('clicked');
    this.router.navigate(['/personalInfo']);
  }
}
