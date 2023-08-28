import { Component, OnInit ,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/srvices/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { SearchService } from 'src/app/srvices/search.service';
import { FormsModule } from '@angular/forms'; 
import { PostService } from 'src/app/srvices/post.service';
import { ApartmentListComponent } from 'src/app/cmps/apartment/apartment-list/apartment-list.component';
import { HttpClient } from '@angular/common/http';


import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';



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
  cityControl = new FormControl();
  filteredCities!: Observable<any[]>;
  cities: any[]=[];

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    private postservice : PostService,
    private http: HttpClient
  ) {
    this.filteredCities = this.cityControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCities(value))
    );
  }

  private _filterCities(value: string): any[] {
    const filterValue = value.toLowerCase();
    // Check if cities is defined and not null before calling filter
    return this.cities ? this.cities.filter((city: { town_name:string; }) => city.town_name.toLowerCase().includes(filterValue)) : [];
  }
  
  ngOnInit() {
    console.log('HomeComponent initialized');
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.logedinUser = user;
      this.cdr.detectChanges();
    });

    this.http.get<any>('../../../assets/Jsons/cities.json').subscribe(data =>{
      this.cities=data.cities;
      console.log('this.cities',this.cities)
    });


    
  }
  searchApartments() {
    this.searchService.setSearchQuery(this.search);
    this.apartmentList.fetchApartments(this.search);
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
