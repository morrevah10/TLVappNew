import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/srvices/post.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
})
export class PostDetailsComponent {
  status!: number;
  postId!: number;
  currPost!: any;

  postForm!: FormGroup;
  enableButton: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.status = +params['status'];
      this.postId = +params['postId'];

      // this.initializeForm();
      this.loadPostDetails(this.postId);
    });
  }

  loadPostDetails(postId: number): void {
    this.postService.getApartmentDetails(postId).subscribe((data: any) => {
      this.currPost = data;
      console.log('this.currPost', this.currPost);
      this.initializeForm();
    });
  }

  initializeForm(): void {
    // Initialize the form group with common controls
    this.postForm = this.fb.group({
      post_city: [this.currPost.post_city, Validators.required],
      post_street: [this.currPost.post_street, Validators.required],
      post_building_number: [
        this.currPost.post_building_number,
        Validators.required,
      ],
      post_apartment_number: [this.currPost.detail4, Validators.required],
      post_rent_start: [this.currPost.post_rent_start, Validators.required],
      post_rent_end: [this.currPost.post_rent_end, Validators.required],
      driving_license: [this.currPost.driving_license],
      rent_agreement: [this.currPost.rent_agreement], 
    });

    this.postForm.valueChanges.subscribe(() => {
      this.enableButton = this.postForm.dirty;
    });
  }

  submitForm(): void {
    console.log('this.postForm.value', this.postForm.value);

    
      if (this.postForm.valid) {
      
        const newPost = {
          ...this.currPost,
          ...this.postForm.value
        };
    
        console.log('newPost',newPost)
        // this.postService.updateApartmentDetails(this.postId, newPost).subscribe(
        //   () => {
        //     // Handle successful update
        //     console.log('Apartment details updated successfully');
        //   },
        //   (error) => {
        //     // Handle error
        //     console.error('Error updating apartment details', error);
        //   }
        // );
      }
    
  }
}
