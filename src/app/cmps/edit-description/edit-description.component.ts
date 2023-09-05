import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from 'src/app/srvices/post.service';
import { Router } from '@angular/router';

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
  errorMessage!: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.apartmentId = +idParam;
      console.log('this.apartmentId', this.apartmentId);

      this.apartmentData = this.postService.getApartmentDetails(
        this.apartmentId
      ).subscribe((data) => {
        console.log('this.apartmentData', data);
        this.apartmentData = data;
      });
    }
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.apartmentData) {
      // handle the form submission here
      console.log('Form submitted:', this.apartmentData);
    }

    this.postService.updatePost(this.apartmentData).subscribe(
      (response) => {
        console.log('Post updated successfully:', response);
        this.router.navigate(['myposts']);
      },
      (error) => {
        console.error('Error updating post:', error);
        this.errorMessage = 'Error updating post: ' + error.message;
      }
    );
  }
}

  
