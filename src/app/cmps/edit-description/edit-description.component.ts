import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from 'src/app/srvices/post.service';
// import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-edit-description',
  templateUrl: './edit-description.component.html',
  styleUrls: ['./edit-description.component.scss'],
})
export class EditDescriptionComponent implements OnInit {
  // editForm: FormGroup;
  apartmentId!: number;
  apartmentData: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private PostService: PostService
  ) {

  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.apartmentId = +idParam;
      console.log('this.apartmentId', this.apartmentId);

      this.apartmentData = this.PostService.getApartmentDetails(
        this.apartmentId
      ).subscribe((data) => {
        console.log('this.apartmentData', data);
        this.apartmentData = data;
      });
    }
  }

  onSubmit() {
    if (this.apartmentData) {
      // handle the form submission here
      console.log('Form submitted:', this.apartmentData);
    }
  }


}
