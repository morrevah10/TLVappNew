import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { PostService } from 'src/app/srvices/post.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rantal',
  templateUrl: './rantal.component.html',
  styleUrls: ['./rantal.component.scss'],
})
//RantalComponent
export class RantalComponent implements OnInit {

  apartmentForm!: FormGroup;
  formData: any;
  loading = false;
  post_id: number = 101;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private toastr: ToastrService

  ) {}

  ngOnInit() {
    this.apartmentForm = this.formBuilder.group({
      post_city: '',
      post_street: '',
      post_apartment_number: '',
      post_apartment_price: '',
      post_rent_start: '',
      post_rent_end: '',
      proof_image: [],
      driving_license: [],
      apartment_pic_1: [],
      post_description: '',
    });
  }

  onSubmit() {
    this.formData = {
      ...this.apartmentForm.value,
      proof_image: this.apartmentForm.get('proof_image')?.value,
      driving_license: this.apartmentForm.get('driving_license')?.value,
      apartment_pic_1: this.apartmentForm.get('apartment_pic_1')?.value,
      post_id: this.post_id,
    };
    console.log('this.formData befor user', this.formData);

    this.loading = true;
    
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.formData.user = user;
      }
    });
    console.log('this.formData after user', this.formData);


    this.postService.addPost(this.formData).subscribe(
      (response) => {
        console.log('Form submitted successfully:', response);
        this.toastr.success('Post add successfully!!');
        this.loading = false;

        this.post_id = this.post_id + 1;
        
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      (error) => {
        this.loading = false;
        console.error('Error submitting form:', error);
      }
    );
  }

  onImageSelected(event: any, controlName: string) {
    if (event.target && event.target.files) {
      const files = event.target.files;
      if (files.length > 0) {
        const imageURLs: string[] = [];
        for (const file of files) {
          const reader = new FileReader();
          reader.onload = (e) => {
            imageURLs.push(e.target?.result as string);
            if (imageURLs.length === files.length) {
              // Update the form control value
              this.apartmentForm.get(controlName)?.setValue(imageURLs);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }
}

