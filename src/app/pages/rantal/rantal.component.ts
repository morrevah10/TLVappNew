import { Component, OnInit, ChangeDetectorRef,ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  currentStep: number = 0;
  mainForm!: FormGroup;
  formData: any;
  loading = false;

  stepTwoData: any = {};
  stepThreeData: any = {};
  stepFourData: any = {};

  formDataSnapshot: any;
  formStates: any[] = [];
  // formValues: any = {}

  // selectedFileName: string | null = null;

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;

  cityAutocomplete$!: Observable<string[]>;
  streetAutocomplete$!: Observable<string[]>;


  selectedFileNames: { [key: string]: string } = {};


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private toastr: ToastrService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.mainForm = this.formBuilder.group({
      stepOne: this.formBuilder.group({
        post_city: ['', Validators.required],
        post_street: ['', Validators.required],
        post_building_number: ['', Validators.required],
        post_apartment_number: ['', Validators.required],
        post_apartment_price: ['', Validators.required],
      }),
      stepTwo: this.formBuilder.group({
        post_rent_start: ['', Validators.required],
        post_rent_end: ['', Validators.required],
        proof_image: [null, Validators.required],
        driving_license: [null, Validators.required],
      }),
      stepThree: this.formBuilder.group({
        apartment_pic_1: [null],
        apartment_pic_2: [null],
        apartment_pic_3: [null],
        apartment_pic_4: [null],
      }),
      stepFour: this.formBuilder.group({
        post_description: ['', Validators.required],
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
    // this.mainForm.get('stepOne.post_street')!.valueChanges.subscribe((value) => {
    //   if (value) {
    //     this.dataService.updateStreetFilter(value);
    //   }
    // });

    this.formStates.push(this.mainForm.getRawValue());
    console.log('this.formStates', this.formStates);
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

        setTimeout(() => {
          this.loading = false;
        }, 5000);

        this.router.navigate(['/home']);
      },
      (error) => {
        this.loading = false;
        console.error('Error submitting form:', error);
      }
    );
  }

  // formatDateToDdMmYyyy(inputDate: Date): string {
  //   // Get day, month, and year components
  //   console.log('inputDate',inputDate)
  //   const date = new Date(inputDate);
  // const day = date.getDate().toString().padStart(2, '0');
  // const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  // console.log('formattedDate',formattedDate)
  // return formattedDate;
  // }
  formatDateToYyyyMmDd(inputDate: Date): string {
    // Get day, month, and year components
    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const year = inputDate.getFullYear();

    // Create the formatted date string in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;
    console.log('formattedDate', formattedDate);

    return formattedDate;
  }

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

  onImageSelectedStep3(event: any, controlName: string, step: string, inputElement: HTMLInputElement) {
    if (event.target && event.target.files) {
      const files = event.target.files;
      if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageURL = e.target?.result as string;
          this.mainForm.get(`${step}.${controlName}`)?.setValue(imageURL);
          // Check if files[0] is defined before accessing its name property
          if (files[0]) {
            const key = `${step}.${controlName}`;
            this.selectedFileNames[key] = files[0].name;
          }
        };
  
        reader.readAsDataURL(files[0]);
      }
    }
  }

  selectedFileName(controlName: string, step: string): string {
    const key = `${step}.${controlName}`;
    return this.selectedFileNames[key] || 'No file selected';
  }

  // onDateSelected(selectedDate: Date, controlName: string) {
  //   console.log('Selected Date:', selectedDate);
  //   const formattedDate = this.formatDateToYyyyMmDd(selectedDate);
  //   this.mainForm.get('stepTwo')?.get(controlName)?.setValue(formattedDate);
  //   console.log('formattedDate:', formattedDate);
  //   // console.log('Form Value:', this.mainForm.value);
  // }

  onDateSelected(selectedDate: Date, controlName: string) {
    if (controlName === 'post_rent_start') {
      this.selectedStartDate = selectedDate;
    } else if (controlName === 'post_rent_end') {
      this.selectedEndDate = selectedDate;
    }

    const formattedDate = this.formatDateToYyyyMmDd(selectedDate);
    this.mainForm.get('stepTwo')?.get(controlName)?.setValue(formattedDate);
    console.log('formattedDate:', formattedDate);
  }

  deleteImage(controlName: string, step: string) {
    // Reset the form control value and the selected image URL
    this.mainForm.get(`${step}.${controlName}`)?.setValue(null);
  }


 
  
  // Helper function to convert data URI to File object
  dataURItoFile(dataURI: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab]);
    return new File([blob], 'image.png'); // You may need to adjust the file name and type
  }

  // nextStep(currentStepName: string) {
  //   console.log('befor', this.currentStep);
  //   if (this.currentStep < 3) {
  //     this.currentStep++;
  //   }
  //   console.log('after', this.currentStep);
  // }

  // prevStep() {
  //   console.log('before', this.currentStep);
  //   if (this.currentStep > 0) {
  //     this.currentStep--;
  //   }
  //   console.log('after', this.currentStep);
  // }

  // prevStep(step: string) {
  //   const currentStepName = this.getStepName(this.currentStep);
  //   console.log(`currentStepName: ${currentStepName}`);
  //   console.log(`this.mainForm.get('${currentStepName}')!.value: `, this.mainForm.get('${currentStepName}')?.value);
  //   console.log(`this.formStates[this.currentStep - 1]: `, this.formStates[this.currentStep - 1]);

  //   this.mainForm.get('${currentStepName}')?.patchValue(this.formStates[this.currentStep - 1]);
  //   console.log('this.formStates[this.currentStep - 1]', this.formStates[this.currentStep - 1]);
  //   console.log('before', this.currentStep);
  //   if (this.currentStep > 0) {
  //     this.currentStep--;
  //   }
  //   console.log('after', this.currentStep);
  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  // }

  getStepName(index: number) {
    if ((index = 0)) {
      return `stepOne`;
    }
    if ((index = 1)) {
      return `stepTwo`;
    }
    if ((index = 2)) {
      return `stepThree`;
    }
    if ((index = 3)) {
      return `stepFour`;
    }
    return 0;
  }
  //   console.log(
  //     `this.mainForm.get('currentStepName')!.value`,
  //     this.mainForm.get('currentStepName')?.value
  //   );
  //   console.log(
  //     `this.formStates[this.currentStep - 1]`,
  //     this.formStates[this.currentStep - 1]
  //   );

  //   this.mainForm.get('currentStepName')!.value ==
  //     this.formStates[this.currentStep - 1];
  //   console.log(
  //     'this.formStates[this.currentStep - 1]',
  //     this.formStates[this.currentStep - 1]
  //   );
  //   console.log('befor', this.currentStep);
  //   if (this.currentStep > 0) {
  //     this.currentStep--;
  //   }
  //   console.log('after', this.currentStep);
  // }
  // updateCurrentStep(step:number){
  //   console.log('befor',this.currentStep)
  //     this.currentStep==step
  //   console.log('after',this.currentStep)
  // }

  triggerFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click(); // Trigger click event on the file input element
    }
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
