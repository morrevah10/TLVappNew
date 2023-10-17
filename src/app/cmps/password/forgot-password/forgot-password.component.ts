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
    private userService: UserService,
    private router: Router,
    private forgetService: ForgetService
  ) {}

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.isHidden = true;
    this.serverResponse = true;

    if (this.forgotPasswordForm && this.forgotPasswordForm.get('email')) {
      if (this.forgotPasswordForm.get('email')!.invalid) {
        return;
      }

      const email = this.forgotPasswordForm.get('email')!.value;

      this.userService.forgetPassword(email).subscribe(
        (response) => {
          console.log('email send successfully:', response);
          this.forgetService.setResponse(response);
          // this.router.navigate(['resetPassword/']);
          this.serverResponse = false;
          this.modalImg = '../../../assets/img/success.png';
          this.modalText = '  נשלחנו קוד לאימייל שלך';
        },
        (error) => {
          // console.error('Error sending email:', error);
          this.errorMessage = error.error;
          console.log('this.errorMessage', this.errorMessage);
          this.submitted = false;
          this.serverResponse = false;
          this.modalImg = '../../../assets/img/eroor.png';
          this.modalText = 'קרתה בעיה.. נסה שוב מאוחר יותר';
        }
      );
    }
  }

  onModalClosed(isHidden: boolean): void {
    console.log(this.isApproved);
    this.isHidden = isHidden;
    this.aprovelText = '';
    this.modalImg = '';
    this.modalText = '';
    this.router.navigate(['resetPassword/']);

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
