import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/srvices/post.service';


@Component({
  selector: 'app-apartment-details',
  templateUrl: './apartment-details.component.html',
  styleUrls: ['./apartment-details.component.scss']
})
export class ApartmentDetailsComponent implements OnInit {
  apartment: any;


  constructor(private route: ActivatedRoute, private postService: PostService) { }

  
  ngOnInit() {
    this.route.params.subscribe(params => {
      const apartmentId = params['id'];
      this.postService.getApartmentDetails(apartmentId).subscribe(
        (apartment) => {
          this.apartment = apartment;
          console.log('this.apartment',this.apartment)
        },
        (error) => {
          console.error('Error fetching apartment details:', error);
        }
      );
    });
  }
}
