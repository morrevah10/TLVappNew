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
  // apartmentForm

  currentStep = 0;
  mainForm!: FormGroup;
  formData: any;
  loading = false;
  selectedDate!: Date;

  cityAutocomplete$!: Observable<string[]>;
  streetAutocomplete$!: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private toastr: ToastrService,
    private dataService: DataService
  ) {
    // this.mainForm = this.formBuilder.group({
    //   stepOne: this.formBuilder.group({
    //     post_city: [''],
    //     post_street: [''],
    //     post_building_number: '',
    //     post_apartment_number: '',
    //     post_apartment_price: '',
    //   }),
    //   stepTwo: this.formBuilder.group({
    //     post_rent_start: '',
    //     post_rent_end: '',
    //     proof_image: [],
    //     driving_license: [],
    //   }),
    //   stepThree: this.formBuilder.group({
    //     apartment_pic_1: [],
    //     apartment_pic_2: [],
    //     apartment_pic_3: [],
    //     apartment_pic_4: [],
    //   }),
    //   stepFour: this.formBuilder.group({
    //     post_description: '',
    //   }),
    // });
  }

  ngOnInit() {
    this.mainForm = this.formBuilder.group({
      stepOne: this.formBuilder.group({
        post_city: [''],
        post_street: [''],
        post_building_number: '',
        post_apartment_number: '',
        post_apartment_price: '',
      }),
      stepTwo: this.formBuilder.group({
        post_rent_start: [''],
        post_rent_end: [''],
        proof_image: [null],
        driving_license: [null],
      }),
      stepThree: this.formBuilder.group({
        apartment_pic_1: [null],
        apartment_pic_2: [null],
        apartment_pic_3: [null],
        apartment_pic_4: [null],
      }),
      stepFour: this.formBuilder.group({
        post_description: '',
      }),
    });

    // Subscribe to city autocomplete values
    this.cityAutocomplete$ = this.dataService.getCities();

    // Subscribe to street autocomplete values
    this.streetAutocomplete$ = this.dataService.getStreets();

    // Subscribe to changes in the city form control
    this.mainForm
      .get('stepOne.post_street')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          // Update city autocomplete data based on value
          this.dataService.updateCityFilter(value);
        }
      });

    // Subscribe to changes in the street form control
    this.mainForm.get('stepOne.post_city')!.valueChanges.subscribe((value) => {
      if (value) {
        // Update city autocomplete data based on value
        this.dataService.updateCityFilter(value);
      }
    });

    this.mainForm
      .get('stepOne.post_street')!
      .valueChanges.subscribe((value) => {
        if (value) {
          // Update street autocomplete data based on value
          this.dataService.updateStreetFilter(
            this.mainForm.get('stepOne.post_city')!.value,
            value
          );
        }
      });
  }

  onSubmit() {
    this.formData = {
      ...this.mainForm.get('stepOne')?.value,
      ...this.mainForm.get('stepTwo')?.value,
      ...this.mainForm.get('stepThree')?.value,
      ...this.mainForm.get('stepFour')?.value,

      proof_image: this.mainForm.get('stepTwo.proof_image')?.value,
      driving_license: this.mainForm.get('stepTwo.driving_license')?.value,
      apartment_pic_1: this.mainForm.get('stepThree.apartment_pic_1')?.value,
      apartment_pic_2: this.mainForm.get('stepThree.apartment_pic_2')?.value,
      apartment_pic_3: this.mainForm.get('stepThree.apartment_pic_3')?.value,
      apartment_pic_4: this.mainForm.get('stepThree.apartment_pic_4')?.value,
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

  formatDateToDdMmYyyy(inputDate: Date): string {
    // Get day, month, and year components
    const day = inputDate.getDate().toString().padStart(2, '0'); // Ensure 2-digit format
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const year = inputDate.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  // onImageSelected(event: any, controlName: string) {
  //   if (event.target && event.target.files) {
  //     const files = event.target.files;
  //     if (files.length > 0) {
  //       const reader = new FileReader();

  //       reader.onload = (e) => {
  //         const imageURL = e.target?.result as string;
  //         this.mainForm.get(controlName)?.setValue(imageURL);
  //       };

  //       reader.readAsDataURL(files[0]);
  //     }
  //   }
  // }

  onImageSelected(event: any, controlName: string, step: string) {
    if (event.target && event.target.files) {
      const files = event.target.files;
      if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageURL = e.target?.result as string;
          this.mainForm.get(`${step}.${controlName}`)?.setValue(imageURL);
        };

        reader.readAsDataURL(files[0]);
      }
    }
  }

  onDateSelected(selectedDate: Date, controlName: string) {
    console.log('Selected Date:', selectedDate);
    const formattedDate = this.formatDateToDdMmYyyy(selectedDate)
    this.mainForm.get('stepTwo')?.get(controlName)?.setValue(formattedDate);
    console.log('formattedDate:', formattedDate);
    console.log('Form Value:', this.mainForm.value);
  }

  nextStep() {
    // Move to the next step and save data to the main form
    this.currentStep++;
  }
  prevStep() {
    // Move to the previous step
    this.currentStep--;
  }
}
// this.apartmentForm = this.formBuilder.group({
//   post_city: [''],
//   post_street: [''],
//   post_building_number: '',
//   post_apartment_number: '',
//   post_apartment_price: '',
//   post_rent_start: '',
//   post_rent_end: '',
//   proof_image: [],
//   driving_license: [],
//   apartment_pic_1: [],
//   apartment_pic_2: [],
//   apartment_pic_3: [],
//   apartment_pic_4: [],
//   post_description: '',
// });
