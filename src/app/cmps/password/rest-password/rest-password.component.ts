import { Component, OnInit } from '@angular/core';
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

  passwordResetForm!: FormGroup;
  loading = false;
  submitted = false;
  response:any;
  showPassword=false
  showPasswordConfirmation= false
  errorMessage='';
  windowWidth!: number;


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private forgetService: ForgetService,
    private router: Router,

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
  
      // Create an object with the three form fields
      const passwordResetData = {
        user_code_input: this.passwordResetForm.get('verificationCode')!.value,
        user_password: this.passwordResetForm.get('newPassword')!.value,
        user_password_2: this.passwordResetForm.get('confirmPassword')!.value,
        user_email : this.response.user.user_email,
        user_code_send:this.response.user.confirm_code ,

      };
  

      this.forgetService.resetPassword(passwordResetData).subscribe(
        (response) => {
          console.log('email send successfully:', response);
          this.router.navigate(['login/']);
        },
        (error) => {
          console.error('Error sending email:', error);
          this.submitted = false;
          this.errorMessage=error.error;
        }
      );

  
      
    }

    togglePasswordVisibility(){
      this.showPassword = !this.showPassword
    }

    togglePasswordConfirmationVisibility(){
      this.showPasswordConfirmation = !this.showPasswordConfirmation
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
