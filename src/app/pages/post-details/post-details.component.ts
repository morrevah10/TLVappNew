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

  selectedFileNames: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.status = +params['status'];
      this.postId = +params['postId'];

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
    
    this.postForm = this.fb.group({
      post_city: [this.currPost.post_city, Validators.required],
      post_street: [this.currPost.post_street, Validators.required],
      post_building_number: [
        this.currPost.post_building_number,
        Validators.required,
      ],
      post_apartment_number: [this.currPost.post_apartment_number
        , Validators.required],
      post_rent_start: [this.currPost.post_rent_start, Validators.required],
      post_rent_end: [this.currPost.post_rent_end, Validators.required],
      driving_license: [this.currPost.driving_license, Validators.required],
      rent_agreement: [this.currPost.rent_agreement, Validators.required], 
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
        this.postService.updateApartmentDetails(newPost).subscribe(
          () => {
            // Handle successful update
            console.log('Apartment details updated successfully');
          },
          (error) => {
            // Handle error
            console.error('Error updating apartment details', error);
          }
        );
      }
    
  }


  onImageSelectedStep(
    event: any,
    controlName: string,
  ) {
    if (event.target && event.target.files) {
      const files = event.target.files;
      if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageURL = e.target?.result as string;
          this.postForm.get(`${controlName}`)?.setValue(imageURL);
          // Check if files[0] is defined before accessing its name property
          if (files[0]) {
            const key = `${controlName}`;
            this.selectedFileNames[key] = files[0].name;
          }
        };

        reader.readAsDataURL(files[0]);
      }
    }
  }

  deleteImage(controlName: string) {
    // Reset the form control value and the selected image URL
    this.postForm.get(`${controlName}`)?.setValue(null);
  }
}
