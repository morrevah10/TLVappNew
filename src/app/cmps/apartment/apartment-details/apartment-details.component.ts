import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/srvices/post.service';
import { UserService } from 'src/app/srvices/user.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-apartment-details',
  templateUrl: './apartment-details.component.html',
  styleUrls: ['./apartment-details.component.scss'],
})
export class ApartmentDetailsComponent implements OnInit {
  apartment: any;
  windowWidth!: number;
  isAuthenticated: boolean = false;
  user:any;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.windowWidth = window.innerWidth;

    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
    });
    this.isAuthenticated = true;

    this.route.params.subscribe((params) => {
      const apartmentId = params['id'];
      this.postService.getApartmentDetails(apartmentId).subscribe(
        (apartment) => {
          this.apartment = apartment;
          console.log('this.apartment', this.apartment);
        },
        (error) => {
          console.error('Error fetching apartment details:', error);
        }
      );
    });
  }
}
