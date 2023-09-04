import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/srvices/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  errorMessages = {
    user_full_name: '',
    user_email: '',
    user_phone: '',
    user_password: '',
    user_password_2: '',
  };


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
  ) {}

  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],

      user_full_name: ['', Validators.required],
      user_phone: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      user_password_2: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get fval() {
    return this.registerForm.controls;
  }
  onFormSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;

    const user = this.registerForm.value;
    console.log(user);

    this.userService.addUser(user).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.toastr.success('User Registered successfully!!');
        this.router.navigate(['/login']);
       
      },
      (error) => {
        this.loading = false;
        // this.submitted = false;
        console.error(error);
        if (error == 'Email already exists') {
          this.errorMessages = { ...this.errorMessages, user_email: error };
          console.log(
            'this.errorMessages.user_email :',
            this.errorMessages.user_email
          );
        }
        this.loading = false;
        // Handle error here
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }



}

