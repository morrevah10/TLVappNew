import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { PostService } from 'src/app/srvices/post.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/srvices/data.service';

@Component({
  selector: 'app-rantal',
  templateUrl: './rantal.component.html',
  styleUrls: ['./rantal.component.scss'],
})
export class RantalComponent implements OnInit {
  apartmentForm!: FormGroup;
  formData: any;
  loading = false;
  post_id: number = 101;

  cityAutocomplete$!: Observable<string[]>;
  streetAutocomplete$!: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private toastr: ToastrService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.apartmentForm = this.formBuilder.group({
      post_city: [''],
      post_street: [''],
      post_building_number: '',
      post_apartment_number: '',
      post_apartment_price: '',
      post_rent_start: '',
      post_rent_end: '',
      proof_image: [],
      driving_license: [],
      apartment_pic_1: [],
      apartment_pic_2: [],
      apartment_pic_3: [],
      apartment_pic_4: [],
      post_description: '',
    });

    // Subscribe to city autocomplete values
    this.cityAutocomplete$ = this.dataService.getCities();

    // Subscribe to street autocomplete values
    this.streetAutocomplete$ = this.dataService.getStreets();

    // Subscribe to changes in the city form control
    this.apartmentForm.get('post_city')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update city autocomplete data based on value
        this.dataService.updateCityFilter(value);
      }
    });

    // Subscribe to changes in the street form control
    this.apartmentForm.get('post_street')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update street autocomplete data based on value
        this.dataService.updateStreetFilter(
          this.apartmentForm.get('post_city')?.value,
          value
        );
      }
    });
  }

  onSubmit() {
    this.formData = {
      ...this.apartmentForm.value,
      proof_image: this.apartmentForm.get('proof_image')?.value,
      driving_license: this.apartmentForm.get('driving_license')?.value,
      apartment_pic_1: this.apartmentForm.get('apartment_pic_1')?.value,
      apartment_pic_2: this.apartmentForm.get('apartment_pic_2')?.value,
      apartment_pic_3: this.apartmentForm.get('apartment_pic_3')?.value,
      apartment_pic_4: this.apartmentForm.get('apartment_pic_4')?.value,
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
        const reader = new FileReader();

        reader.onload = (e) => {
          const imageURL = e.target?.result as string;
          this.apartmentForm.get(controlName)?.setValue(imageURL);
        };

        reader.readAsDataURL(files[0]);
      }
    }
  }
}
