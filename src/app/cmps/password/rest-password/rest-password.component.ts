import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ForgetService } from 'src/app/srvices/forget.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rest-password',
  templateUrl: './rest-password.component.html',
  styleUrls: ['./rest-password.component.scss'],
})
export class RestPasswordComponent implements OnInit {
  @ViewChild('input1') input1!: ElementRef<HTMLInputElement>;
  @ViewChild('input2') input2!: ElementRef<HTMLInputElement>;
  @ViewChild('input3') input3!: ElementRef<HTMLInputElement>;
  @ViewChild('input4') input4!: ElementRef<HTMLInputElement>;

  currentStep = 1;

  confirmationCode: string = '';
  passwordResetForm!: FormGroup;
  loading = false;
  submitted = false;
  response: any;
  showPassword = false;
  showPasswordConfirmation = false;
  errorMessage = '';
  windowWidth!: number;

  needApproval: boolean = false;
  aprovelText = '';
  modalImg = '';
  modalText = '';
  isHidden: boolean = false;
  isApproved = false;
  serverResponse = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private forgetService: ForgetService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;

    this.response = this.forgetService.getResponse();

    // Now you can use the 'response' object in your component as needed
    console.log('Response from previous page:', this.response);

    this.passwordResetForm = this.formBuilder.group({
      verificationCode: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.passwordResetForm.invalid) {
      return;
    }
    this.isHidden = true;
    this.serverResponse = true;

    // Create an object with the three form fields
    const passwordResetData = {
      user_code_input: this.passwordResetForm.get('verificationCode')!.value,
      user_password: this.passwordResetForm.get('newPassword')!.value,
      user_password_2: this.passwordResetForm.get('confirmPassword')!.value,
      user_email: this.response.user.user_email,
      user_code_send: this.response.user.confirm_code,
    };

    console.log('befor')

    this.forgetService.resetPassword(passwordResetData).subscribe(
      (response) => {
        console.log('email send successfully:', response);
        // this.router.navigate(['login/']);
        this.serverResponse = false;
        this.modalImg = '../../../assets/img/success.png';
        this.modalText = '  הסיסמא שונתה בהצלחה ';
      },
      (error) => {
        console.error('Error sending email:', error);
        this.submitted = false;
        this.serverResponse = false;
        this.modalImg = '../../../assets/img/eroor.png';
        this.modalText = 'קרתה בעיה.. נסה שוב מאוחר יותר';
        // this.errorMessage=error.error;
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmationVisibility() {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }

  // verifyCodeAndContinue() {
  //   // Add logic to verify the entered code with the backend
  //   // If the code is verified successfully, proceed to step 2
  //   // For example:
  //   // if (this.verifyCode()) {
  //   //   this.currentStep = 2;
  //   // }
  //   this.currentStep = 2;
  //   console.log('Confirmation Code:', this.confirmationCode);
  // }

  verifyCodeAndContinue(){
    
  }

  onInput(currentInput: HTMLInputElement, nextInput: HTMLInputElement | null) {
    const inputValue = currentInput.value;

    if (inputValue.length === 1 && nextInput) {
      nextInput.focus(); // Move focus to the next input
    }

    // Check if the input is in the last box and print the confirmation code
    if (!nextInput) {
      const confirmationCode = [
        this.input1.nativeElement.value,
        this.input2.nativeElement.value,
        this.input3.nativeElement.value,
        this.input4.nativeElement.value,
      ].join('');

      if (confirmationCode.length === 4) {
        this.confirmationCode = confirmationCode;
        console.log('Confirmation Code:', confirmationCode);
      }
    }
  }

  reset() {
    console.log('hit reset // move to login page');
  }

  onModalClosed(isHidden: boolean): void {
    console.log(this.isApproved);
    this.isHidden = isHidden;
    this.aprovelText = '';
    this.modalImg = '';
    this.modalText = '';
    this.router.navigate(['login/']);

    if (this.isApproved) {
      // this.userService.clearUser();
      // this.router.navigate(['/login']);
    }
  }

  onAprovel(isApproved: boolean): void {
    this.isApproved = isApproved;
    console.log(this.isApproved);
  }
}

// onSubmit() {
//   this.submitted = true;
//   if (this.passwordResetForm.invalid) {
//     return;
//   }

//   const resetCode = this.passwordResetForm.get('resetCode').value;
//   const newPassword = this.passwordResetForm.get('newPassword').value;

//   // Make a network call to reset the password
//   this.http.post('/api/reset-password', { resetCode, newPassword }).subscribe(
//     (response) => {
//       // Handle password reset success, e.g., show a success message and navigate to the login page
//     },
//     (error) => {
//       // Handle password reset errors
//     }
//   );
// }
