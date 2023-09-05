import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { Router } from '@angular/router';
import { ForgetService } from '../../../srvices/forget.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private forgetService:ForgetService
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.forgotPasswordForm && this.forgotPasswordForm.get('email')) {
      if (this.forgotPasswordForm.get('email')!.invalid) {
        return;
      }

      const email = this.forgotPasswordForm.get('email')!.value;

      this.userService.forgetPassword(email).subscribe(
        (response) => {
          console.log('email send successfully:', response);
          this.forgetService.setResponse(response);
          this.router.navigate(['resetPassword/']);
        },
        (error) => {
          console.error('Error sending email:', error);
          this.submitted = false;
        }
      );
    }
  }
}
