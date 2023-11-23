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

  response:boolean=false;
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
          this.response=true
          this.serverResponse = false;
          this.modalImg = '../../../assets/img/success.png';
          this.modalText = '  נשלח קוד לאימייל שלך';
        },
        (error) => {
          this.response=false
          this.errorMessage = error.error;
          console.log('this.errorMessage', this.errorMessage);
          this.submitted = true;
          this.serverResponse = false;
          this.modalImg = '../../../assets/img/eroor.png';
          this.modalText = this.errorMessage;
        }
      );
    }
  }

  onModalClosed(isHidden: boolean): void {
    
    console.log(this.submitted, 'this.submitted');
    console.log(this.serverResponse, 'this.serverResponse');
    console.log(this.isApproved, 'this.isApproved');
    console.log(this.response,'this.response')

    if(this.response){
      this.router.navigate(['resetPassword/']);
    }else{
      this.isHidden = isHidden;
      this.aprovelText = '';
      this.modalImg = '';
      this.modalText = '';
      this.router.navigate(['forgetPassword/']);
    }


    // console.log(this.submitted, 'this.submitted');
    // console.log(this.serverResponse, 'this.serverResponse');
    // console.log(this.isApproved, 'this.isApproved');


    // this.isHidden = isHidden;
    // this.aprovelText = '';
    // this.modalImg = '';
    // this.modalText = '';
    // this.router.navigate(['resetPassword/']);

    // if (this.isApproved) {
    //   this.userService.clearUser();
    //   this.router.navigate(['/login']);
    // }
  }

  onAprovel(isApproved: boolean): void {
    this.isApproved = isApproved;
    console.log(this.isApproved);
  }
}
