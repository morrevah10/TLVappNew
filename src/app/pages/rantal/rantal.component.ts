// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import {
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
// import { UserService } from 'src/app/srvices/user.service';
// import { PostService } from 'src/app/srvices/post.service';
// import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { Observable } from 'rxjs';
// import { DataService } from 'src/app/srvices/data.service';
// import { DatepickerComponent } from 'src/app/cmps/datepicker/datepicker.component';

// @Component({
//   selector: 'app-rantal',
//   templateUrl: './rantal.component.html',
//   styleUrls: ['./rantal.component.scss'],
// })
// export class RantalComponent implements OnInit {
//   // apartmentForm

//   fileInputs: {
//     stepTwoForm: { [key: string]: File | null };
//     stepThreeForm: { [key: string]: File | null };
//   } = {
//     stepTwoForm: {
//       proof_image: null,
//       driving_license: null,
//       // Add other file input names for step two as needed
//     },
//     stepThreeForm: {
//       apartment_pic_1: null,
//       apartment_pic_2: null,
//       apartment_pic_3: null,
//       apartment_pic_4: null,
//       // Add other file input names for step three as needed
//     },
//   };

//   formDataStep1: any = {}; // Initialize with default values
//   formDataStep2: any = {};
//   formDataStep3: any = {};
//   formDataStep4: any = {};

//   currentStep: number = 0;
//   mainForm!: FormGroup;
//   formData: any = {};
//   loading = false;

//   stepOneForm!: FormGroup;
//   stepTwoForm!: FormGroup;
//   stepThreeForm!: FormGroup;
//   stepFourForm!: FormGroup;

//   selectedStartDate: Date | null = null;
//   selectedEndDate: Date | null = null;

//   cityAutocomplete$!: Observable<string[]>;
//   streetAutocomplete$!: Observable<string[]>;

//   constructor(
//     private formBuilder: FormBuilder,
//     private userService: UserService,
//     private postService: PostService,
//     private router: Router,
//     private toastr: ToastrService,
//     private dataService: DataService,
//     private cdRef: ChangeDetectorRef
//   ) {}

//   ngOnInit() {
//     this.stepOneForm = this.formBuilder.group({
//       post_city: ['', Validators.required],
//       post_street: ['', Validators.required],
//       post_building_number: ['', Validators.required],
//       post_apartment_number: ['', Validators.required],
//       post_apartment_price: ['', Validators.required],
//     });

//     this.stepTwoForm = this.formBuilder.group({
//       post_rent_start: ['', Validators.required],
//       post_rent_end: ['', Validators.required],
//       proof_image: [null, Validators.required],
//       driving_license: [null, Validators.required],
//     });

//     this.stepThreeForm = this.formBuilder.group({
//       apartment_pic_1: [null],
//       apartment_pic_2: [null],
//       apartment_pic_3: [null],
//       apartment_pic_4: [null],
//     });

//     this.stepFourForm = this.formBuilder.group({
//       post_description: ['', Validators.required],
//     });

//     this.stepOneForm.patchValue(this.formDataStep1);
//     this.stepTwoForm.patchValue(this.formDataStep2);
//     this.stepThreeForm.patchValue(this.formDataStep3);
//     this.stepFourForm.patchValue(this.formDataStep4);
//     // Subscribe to city autocomplete values
//     this.cityAutocomplete$ = this.dataService.getCities();

//     // Subscribe to street autocomplete values
//     this.streetAutocomplete$ = this.dataService.getStreets();

//     // Subscribe to changes in the city form control
//     this.stepOneForm.get('post_street')?.valueChanges.subscribe((value) => {
//       if (value) {
//         // Update city autocomplete data based on value
//         this.dataService.updateCityFilter(value);
//       }
//     });

//     // Subscribe to changes in the street form control
//     this.stepOneForm.get('post_city')!.valueChanges.subscribe((value) => {
//       if (value) {
//         // Update city autocomplete data based on value
//         this.dataService.updateCityFilter(value);
//       }
//     });

//     this.stepOneForm.get('post_street')!.valueChanges.subscribe((value) => {
//       if (value) {
//         // Update street autocomplete data based on value
//         this.dataService.updateStreetFilter(
//           this.stepOneForm.get('post_city')!.value,
//           value
//         );
//       }
//     });

//     if (this.stepOneForm.get('post_city')?.value) {
//       this.formData.post_city = this.stepOneForm.get('post_city')?.value;
//     }

//   }

//   onSubmit() {
//     const formattedStartDate = this.formatDateToYyyyMmDd(
//       this.selectedStartDate!
//     );
//     const formattedEndDate = this.formatDateToYyyyMmDd(this.selectedEndDate!);

//     this.formData = {
//       ...this.stepOneForm.value,
//       ...this.stepTwoForm.value,
//       ...this.stepThreeForm.value,
//       ...this.stepFourForm.value,

//       proof_image: this.stepTwoForm.get('proof_image')?.value,
//       driving_license: this.stepTwoForm.get('driving_license')?.value,
//       apartment_pic_1: this.stepThreeForm.get('apartment_pic_1')?.value,
//       apartment_pic_2: this.stepThreeForm.get('apartment_pic_2')?.value,
//       apartment_pic_3: this.stepThreeForm.get('apartment_pic_3')?.value,
//       apartment_pic_4: this.stepThreeForm.get('apartment_pic_4')?.value,
//     };
//     console.log('this.formData befor user', this.formData);

//     this.loading = true;

//     this.userService.user$.subscribe((user) => {
//       if (user) {
//         this.formData.user = user;
//       }
//     });
//     console.log('this.formData after user', this.formData);

//     this.postService.addPost(this.formData).subscribe(
//       (response) => {
//         console.log('Form submitted successfully:', response);
//         this.toastr.success('Post add successfully!!');

//         setTimeout(() => {
//           this.loading = false;
//         }, 5000);

//         this.router.navigate(['/home']);
//       },
//       (error) => {
//         this.loading = false;
//         console.error('Error submitting form:', error);
//       }
//     );
//   }

//   formatDateToYyyyMmDd(inputDate: Date): string {
//     // Get day, month, and year components
//     const day = inputDate.getDate().toString().padStart(2, '0');
//     const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
//     const year = inputDate.getFullYear();

//     // Create the formatted date string in "YYYY-MM-DD" format
//     const formattedDate = `${year}-${month}-${day}`;

//     return formattedDate;
//   }

//   onImageSelected(event: any, controlName: string, stepForm: string) {
//     if (event.target && event.target.files) {
//       const files = event.target.files;
//       if (files.length > 0) {
//         // Update the file input based on the stepForm and controlName
//         if (stepForm === 'stepTwoForm' || stepForm === 'stepThreeForm') {
//           this.fileInputs[stepForm][controlName] = files[0];
//         }
//       }
//     }
//   }

//   logFormValidity() {
//     console.log('stepTwoForm validity:', this.stepTwoForm.valid);
//   }

//   onDateSelected(selectedDate: Date, controlName: string) {
//     if (controlName == 'post_rent_start') {
//       this.selectedStartDate = selectedDate;
//       console.log('this.selectedStartDate', this.selectedStartDate);
//     } else {
//       if (controlName == 'post_rent_end') {
//         this.selectedEndDate = selectedDate;
//         console.log('this.selectedEndDate', this.selectedEndDate);
//       }
//     }
//   }

//   nextStep(currentStepName: string) {
//     console.log('before', this.currentStep);

//     if (currentStepName == 'stepTwo') {
//       const controlNameStart = 'post_rent_start';
//       const controlNameEnd = 'post_rent_end';
//       if (this.selectedStartDate !== null && this.selectedEndDate !== null) {

//         this.stepTwoForm
//           .get(controlNameStart)
//           ?.setValue(this.selectedStartDate);
//         this.stepTwoForm.get(controlNameEnd)?.setValue(this.selectedEndDate);
//       }
//     }

//     this.saveFormData(currentStepName);
//     if (this.currentStep < 3) {
//       this.currentStep++;
//     }
//     console.log('after', this.currentStep);
//   }

//   saveFormData(formName: string) {
//     if (formName === 'stepOneForm') {
//       this.formDataStep1 = this.stepOneForm.value;
//     } else if (formName === 'stepTwoForm') {
//       this.formDataStep2 = this.stepTwoForm.value;
//     } else if (formName === 'stepThreeForm') {
//       this.formDataStep3 = this.stepThreeForm.value;
//     } else if (formName === 'stepFourForm') {
//       this.formDataStep4 = this.stepFourForm.value;
//     }
//   }

//   prevStep(currentStepName: string) {
//     console.log('before', this.currentStep);
//     this.saveFormData(currentStepName);

//     if (this.currentStep > 0) {
//       this.currentStep--;
//     }

//     // Load the data from the previous step's form into the formData object

//     console.log('after', this.currentStep);
//   }

//   loadFormData(stepName: string) {
//     switch (stepName) {
//       case 'stepOneForm':
//         this.formData = this.stepOneForm.value;
//         break;
//       case 'stepTwoForm':
//         this.formData = this.stepTwoForm.value;
//         break;
//       case 'stepThreeForm':
//         this.formData = this.stepThreeForm.value;
//         break;
//       case 'stepFourForm':
//         this.formData = this.stepFourForm.value;
//         break;
//       default:
//         // Handle other cases or throw an error if needed
//         break;
//     }
//   }

//   getStepName(index: number) {
//     if ((index = 0)) {
//       return `stepOne`;
//     }
//     if ((index = 1)) {
//       return `stepTwo`;
//     }
//     if ((index = 2)) {
//       return `stepThree`;
//     }
//     if ((index = 3)) {
//       return `stepFour`;
//     }
//     return 0;
//   }
// }

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { PostService } from 'src/app/srvices/post.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/srvices/data.service';
import { DatepickerComponent } from 'src/app/cmps/datepicker/datepicker.component';

@Component({
  selector: 'app-rantal',
  templateUrl: './rantal.component.html',
  styleUrls: ['./rantal.component.scss'],
})
export class RantalComponent implements OnInit {
  formData: any = {};
  currentStep: number = 0;

  stepOneForm!: FormGroup;
  stepTwoForm!: FormGroup;
  stepThreeForm!: FormGroup;
  stepFourForm!: FormGroup;

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;

  cityAutocomplete$!: Observable<string[]>;
  streetAutocomplete$!: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private toastr: ToastrService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {



  }

  ngOnInit() {
    this.formData = {
      stepOneForm: {},
      stepTwoForm: {},
      stepThreeForm: {},
      stepFourForm: {},
    };

    this.stepOneForm = this.formBuilder.group({
      post_city: ['', Validators.required],
      post_street: ['', Validators.required],
      post_building_number: ['', Validators.required],
      post_apartment_number: ['', Validators.required],
      post_apartment_price: ['', Validators.required],
    });

    this.stepTwoForm = this.formBuilder.group({
      post_rent_start: ['', Validators.required],
      post_rent_end: ['', Validators.required],
      proof_image: [null, Validators.required],
      driving_license: [null, Validators.required],
    });

    this.stepThreeForm = this.formBuilder.group({
      apartment_pic_1: [null],
      apartment_pic_2: [null],
      apartment_pic_3: [null],
      apartment_pic_4: [null],
    });

    this.stepFourForm = this.formBuilder.group({
      post_description: ['', Validators.required],
    });
  

    // Subscribe to city autocomplete values
    this.cityAutocomplete$ = this.dataService.getCities();

    // Subscribe to street autocomplete values
    this.streetAutocomplete$ = this.dataService.getStreets();

    // Subscribe to changes in the city form control
    this.stepOneForm.get('post_street')?.valueChanges.subscribe((value) => {
      if (value) {
        // Update city autocomplete data based on value
        this.dataService.updateCityFilter(value);
      }
    });

    // Subscribe to changes in the street form control
    this.stepOneForm.get('post_city')!.valueChanges.subscribe((value) => {
      if (value) {
        // Update city autocomplete data based on value
        this.dataService.updateCityFilter(value);
      }
    });

    this.stepOneForm.get('post_street')!.valueChanges.subscribe((value) => {
      if (value) {
        // Update street autocomplete data based on value
        this.dataService.updateStreetFilter(
          this.stepOneForm.get('post_city')!.value,
          value
        );
      }
    });

    if (this.stepOneForm.get('post_city')?.value) {
      this.formData.post_city = this.stepOneForm.get('post_city')?.value;
    }
  }

  onSubmit() {
    // Merge all form data into the formData object
    this.formData = {
      ...this.formData,
      ...this.stepOneForm.value,
      ...this.stepTwoForm.value,
      ...this.stepThreeForm.value,
      ...this.stepFourForm.value,
    };

    // Handle the rest of your form submission logic here
    // ...

    console.log('this.formData after user', this.formData);

    this.postService.addPost(this.formData).subscribe(
      (response) => {
        console.log('Form submitted successfully:', response);
        this.toastr.success('Post add successfully!!');

        // setTimeout(() => {
        //   this.loading = false;
        // }, 5000);

        this.router.navigate(['/home']);
      },
      (error) => {
        // this.loading = false;
        console.error('Error submitting form:', error);
      }
    );
  }

  onImageSelected(event: any, controlName: string, stepForm: string) {
    if (event.target && event.target.files) {
      const files = event.target.files;
      if (files.length > 0) {
        // Update the file input based on the stepForm and controlName
        if (stepForm === 'stepTwoForm' || stepForm === 'stepThreeForm') {
          this.formData[controlName] = files[0];
        }
      }
    }
  }

  onDateSelected(selectedDate: Date, controlName: string) {
    if (controlName === 'post_rent_start') {
      this.selectedStartDate = selectedDate;
      console.log('this.selectedStartDate', this.selectedStartDate);
    } else if (controlName === 'post_rent_end') {
      this.selectedEndDate = selectedDate;
      console.log('this.selectedEndDate', this.selectedEndDate);
    }
  }

  nextStep() {
    this.saveFormData();
    if (this.currentStep < 3) {
      this.currentStep++;
      this.loadFormData(); // Load saved data for the next step
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.saveFormData(); // Save data before going back
      this.currentStep--;
      this.loadFormData(); // Load saved data for the previous step
    }
  }

  saveFormData() {
    switch (this.currentStep) {
      case 0:
        this.formData.stepOneForm = { ...this.stepOneForm.value };
        break;
      case 1:
        this.formData.stepTwoForm = { ...this.stepTwoForm.value };
        break;
      case 2:
        this.formData.stepThreeForm = { ...this.stepThreeForm.value };
        break;
      case 3:
        this.formData.stepFourForm = { ...this.stepFourForm.value };
        break;
      default:
        // Handle other cases or throw an error if needed
        break;
    }
  }

  loadFormData() {
    switch (this.currentStep) {
      case 0:
        this.stepOneForm.patchValue(this.formData.stepOneForm);
        break;
      case 1:
        this.stepTwoForm.patchValue(this.formData.stepTwoForm);
        break;
      case 2:
        this.stepThreeForm.patchValue(this.formData.stepThreeForm);
        break;
      case 3:
        this.stepFourForm.patchValue(this.formData.stepFourForm);
        break;
      default:
        // Handle other cases or throw an error if needed
        break;
    }
  }

  getStepName(index: number) {
    switch (index) {
      case 0:
        return 'stepOne';
      case 1:
        return 'stepTwo';
      case 2:
        return 'stepThree';
      case 3:
        return 'stepFour';
      default:
        return '';
    }
  }
}
