import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from 'src/app/srvices/post.service';

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.scss']
})
export class ImagePageComponent implements OnInit {
  postDetails: any; 
  imageForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private postService: PostService
  ) {
    this.imageForm = this.formBuilder.group({
      apartment_pic_1: [''],
      apartment_pic_2: [''],
      apartment_pic_3: [''],
      apartment_pic_4: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const postId = params['apartmentId'];
      console.log('postId from updatimg',postId)

      if (postId) {
        this.fetchPostDetails(postId);
      }
      
    });
  }

  fetchPostDetails(postId: number): void {
    this.postService.getApartmentDetails(postId).subscribe(
      (data) => {
        this.postDetails = data;
        console.log('postDetails',this.postDetails)
        this.imageForm.patchValue({
          apartment_pic_1: this.postDetails.apartment_pic_1,
          apartment_pic_2: this.postDetails.apartment_pic_2,
          apartment_pic_3: this.postDetails.apartment_pic_3,
          apartment_pic_4: this.postDetails.apartment_pic_4
        });
      },
      (error) => {
        console.error('Error fetching post details:', error);
      }
    );
  }

  updateImage(): void {
    this.postDetails.apartment_pic_1 = this.imageForm.get('apartment_pic_1')?.value;
    this.postDetails.apartment_pic_2 = this.imageForm.get('apartment_pic_2')?.value;
    this.postDetails.apartment_pic_3 = this.imageForm.get('apartment_pic_3')?.value;
    this.postDetails.apartment_pic_4 = this.imageForm.get('apartment_pic_4')?.value;
  }

  deleteImage(imageField: string): void {
    this.imageForm.get(imageField)!.setValue('');
    this.updateImage(); 
  }

  onImageSelected(event: any, imageField: string): void {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const imageUrl = e.target.result;
        this.imageForm.get(imageField)!.setValue(imageUrl);
        this.updateImage();
      };
  
      reader.readAsDataURL(file);
    }
  }








  
    
    submitForm(): void {
      this.updateImage(); 
    this.postService.updateAprtemanetPics(this.postDetails).subscribe(
        (response) => {
            console.log('Post updated successfully:', response);
        },
        (error) => {
            console.error('Error updating post:', error);
        }
    );
}






  
}
