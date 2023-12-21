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

  errorMessage=''
  windowWidth!: number;

  isChecked: boolean = false;




  showPasswordTooltip: boolean = false;



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
  showPasswordConfirmation = false;

  ngOnInit() {
    this.windowWidth = window.innerWidth;
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
    console.log('click')
    this.submitted = true;
    if (this.registerForm.invalid) {
      console.log('this.registerForm',this.registerForm);
    }
    this.loading = true;

    const user = this.registerForm.value;
    console.log(user);

    this.userService.addUser(user).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        // this.toastr.success('User Registered successfully!!');
        this.router.navigate(['/login']);
       
      },
      (error) => {
        this.loading = false;
        console.error(error);
        this.errorMessage = error
        console.log('this.errorMessage',this.errorMessage)



        
        this.loading = false;
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordConfirmationVisibility(){
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }


  toggleToolTipVisibility(){
    this.showPasswordTooltip = !this.showPasswordTooltip
    console.log('tolltip',this.showPasswordTooltip)
}



onCheckboxChange(event: any) {
  this.isChecked = event.target.checked;
  console.log('Checkbox value:', this.isChecked);
}
}