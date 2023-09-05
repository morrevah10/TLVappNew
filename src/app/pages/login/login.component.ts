import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/srvices/user.service';


// import { AuthenticationService } from '../../srvices/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  showPassword=false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    // private authenticationService : AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // for accessing to form fields
  get fval() {
    return this.loginForm.controls;
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.fval['email'].value;
    const password = this.fval['password'].value;
    



    this.userService.loginUser(email, password).subscribe(
      (response) => {
        console.log('response:', response);
        this.userService.setUser(response.user);
        this.toastr.success('User Registered successfully!!');
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
       
      },
      (error) => {
        this.loading = false;
        // this.submitted = false;
        console.error(error);
        // if (error == 'Email already exists') {
        //   this.errorMessages = { ...this.errorMessages, user_email: error };
        //   console.log(
        //     'this.errorMessages.user_email :',
        //     this.errorMessages.user_email
        //   );
        // }
        // this.loading = false;
        // Handle error here
      }
    );


  }


  togglePasswordVisibility(){
    this.showPassword = !this.showPassword
  }
}
   