import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { PostService } from 'src/app/srvices/post.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, take } from 'rxjs';
import { DataService } from 'src/app/srvices/data.service';
import { DatePipe } from '@angular/common';
import { parse } from 'date-fns';


@Component({
  selector: 'app-rantal',
  templateUrl: './rantal.component.html',
  styleUrls: ['./rantal.component.scss'],
  providers: [DatePipe],
})
export class RantalComponent implements OnInit {
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

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;

  cityAutocomplete$!: Observable<string[]>;
  streetAutocomplete$!: Observable<string[]>;

  selectedFileNames: { [key: string]: string } = {};

  needApproval: boolean = false;
  aprovelText = '';
  modalImg = '';
  modalText = '';
  isHidden: boolean = false;
  isApproved = false;
  serverResponse = false;

  sliderValue = 0;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private toastr: ToastrService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe
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
        post_rent_start: [
          '',
          [Validators.required],
        ],
        post_rent_end: [
          '',
          [Validators.required],
        ],
        rent_agreement: [null, Validators.required],
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
        post_rating: [
          0,
          [Validators.required, Validators.min(0), Validators.max(5)],
        ],
        post_comments: [''],
      }),
    });

    this.mainForm.get('stepOne.post_city')?.setValidators([
      Validators.required,
      this.validateCity.bind(this), // Custom validation function
    ]);

    this.mainForm.get('stepOne.post_street')?.setValidators([
      Validators.required,
      this.validateStreet.bind(this), // Custom validation function
    ]);

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

    this.formStates.push(this.mainForm.getRawValue());
    console.log('this.formStates', this.formStates);
  }

  onSubmit() {
    this.formData = {
      ...this.mainForm.get('stepOne')?.value,
      ...this.mainForm.get('stepTwo')?.value,
      ...this.mainForm.get('stepThree')?.value,
      ...this.mainForm.get('stepFour')?.value,

      rent_agreement: this.mainForm.get('stepTwo.rent_agreement')?.value,
      driving_license: this.mainForm.get('stepTwo.driving_license')?.value,
      apartment_pic_1: this.mainForm.get('stepThree.apartment_pic_1')?.value,
      apartment_pic_2: this.mainForm.get('stepThree.apartment_pic_2')?.value,
      apartment_pic_3: this.mainForm.get('stepThree.apartment_pic_3')?.value,
      apartment_pic_4: this.mainForm.get('stepThree.apartment_pic_4')?.value,

    };

    console.log('this.formData.post_rent_start',this.formData.post_rent_start.value)
    console.log('this.formData.post_rent_end',this.formData.post_rent_end.value)

    this.formData.post_rent_start = this.formatDateToYyyyMmDd(new Date(this.mainForm.get('stepTwo.post_rent_start')?.value));

    this.formData.post_rent_end = this.formatDateToYyyyMmDd(new Date(this.mainForm.get('stepTwo.post_rent_end')?.value));

    console.log('this.formData befor user', this.formData);

    this.loading = true;

    this.userService.user$.subscribe((user) => {
      if (user) {
        this.formData.user = user;
      }
    });
    console.log('this.formData after user', this.formData);

    this.isHidden = true;
    this.serverResponse = true;

    this.postService.addPost(this.formData).subscribe(
      (response) => {
        console.log('Form submitted successfully:', response);
        this.serverResponse = false;
        this.modalImg = '../../../assets/img/success.png';
        this.modalText = 'חוות הדעת שלך התקבלה בהצלחה';
      },
      (error) => {
        this.loading = false;
        this.serverResponse = false;
        this.modalImg = '../../../assets/img/eroor.png';
        this.modalText = 'קרתה בעיה.. נסה שוב מאוחר יותר';
        console.error('Error submitting form:', error);
      }
    );
  }

  formatDateToYyyyMmDd(inputDate: Date): string {
    console.log('this.formData.post_rent_start',this.mainForm.get('stepTwo.post_rent_start')?.value)
    console.log('this.formData.post_rent_end',this.mainForm.get('stepTwo.post_rent_end')?.value)
    console.log('inputDate',inputDate)
    if (!inputDate) {
      return '';
    }
  
    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const year = inputDate.getFullYear();
  
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

  onSliderChange(event: any) {
    // Update the form control value when the slider changes
    this.mainForm.get('stepFour.post_rating')!.setValue(event.target.value);
    console.log(typeof this.mainForm.get('stepFour.post_rating.target.value'));
  }

  onImageSelectedStep3(
    event: any,
    controlName: string,
    step: string,
    inputElement: HTMLInputElement
  ) {
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

  // onDateSelected(selectedDate: Date, controlName: string) {
  //   // Extract only the date part from the selectedDate
  //   const dateWithoutTime = new Date(
  //     selectedDate.getFullYear(),
  //     selectedDate.getMonth(),
  //     selectedDate.getDate()
  //   );

  //   const formattedDate = this.formatDate(dateWithoutTime);
  //   console.log('Formatted Date:', formattedDate);
  //   console.log('Formatted Date Length:', (formattedDate || '').length);

  //   console.log(
  //     'Before Setting Value:',
  //     this.mainForm.get(`stepTwo.${controlName}`)!.value
  //   );
  //   this.mainForm.get(`stepTwo.${controlName}`)!.setValue(formattedDate);
  //   console.log(
  //     'After Setting Value:',
  //     this.mainForm.get(`stepTwo.${controlName}`)!.value
  //   );

  //   console.log(
  //     'Control Valid:',
  //     this.mainForm.get(`stepTwo.${controlName}`)!.valid
  //   );
  // }

  private formatDate(date: Date): string {
    // Implement the logic to format the date based on your form's requirements
    // For example, you can use Angular's DatePipe or a custom formatting function
    // Here's an example using Angular's DatePipe:
    console.log('date', date);
    const formattedDate = this.datePipe.transform(date, 'dd-MM-yyyy');
    console.log('formattedDate', formattedDate);
    return (formattedDate || '').trim(); // Handle null or undefined values
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

  triggerFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click(); // Trigger click event on the file input element
    }
  }

  onModalClosed(isHidden: boolean): void {
    console.log(this.isApproved);
    this.isHidden = isHidden;
    this.aprovelText = '';
    this.modalImg = '';
    this.modalText = '';
    if (!this.isApproved) {
      // this.userService.clearUser();
      // this.router.navigate(['/login']);
      setTimeout(() => {
        this.loading = false;
      }, 1500);

      this.router.navigate(['/home']);
    }
  }

  onAprovel(isApproved: boolean): void {
    this.isApproved = isApproved;
    console.log(this.isApproved);
  }

  validateCity(control: AbstractControl) {
    const city = control.value;
    const isValid = this.validateAutocompleteValue(
      city,
      this.cityAutocomplete$
    );

    if (!isValid && (control.dirty || control.touched)) {
      return { invalidCity: true };
    }

    return null;
  }

  validateStreet(control: AbstractControl) {
    const street = control.value;
    const isValid = this.validateAutocompleteValue(
      street,
      this.streetAutocomplete$
    );

    if (!isValid && (control.dirty || control.touched)) {
      return { invalidStreet: true };
    }

    return null;
  }

  validateAutocompleteValue(
    value: string,
    options$: Observable<string[]>
  ): boolean {
    let isValid = false;

    options$
      .pipe(
        take(1),
        map((options) => {
          isValid = options.includes(value);
        })
      )
      .subscribe();

    return isValid;
  }
}
