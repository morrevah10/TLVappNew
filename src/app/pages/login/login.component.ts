import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/srvices/user.service';
import { AuthService } from '../../srvices/auth.service';

import { ResponsesService } from 'src/app/srvices/responses.service';


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
  errorMassege = '';
  windowWidth!: number;
  greetingMessage='';


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private ResponsesService:ResponsesService,

  ) {
    ResponsesService.loadTranslationDictionary()
  }

  ngOnInit() {

    this.windowWidth = window.innerWidth;
    
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.setGreetingMessage()

  }

  // for accessing to form fields
  get fval() {
    return this.loginForm.controls;
  }

  onFormSubmit() {
    this.errorMassege= ''
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
        this.authService.login()
        // this.toastr.success('User Registered successfully!!');
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
       
      },
      (error) => {
        this.loading = false;
        // this.submitted = false;
        console.error(error);
        this.errorMassege= error.error
        console.log(' this.errorMassege', this.errorMassege)
        
      }
    );


  }


  setGreetingMessage(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

     
      
      if (currentHour >= 5 && currentHour < 12) {
        this.greetingMessage = `בוקר טוב`;
      } else if (currentHour >= 12 && currentHour < 17) {
        this.greetingMessage = `צוהריים טובים`;
      } else if (currentHour >= 17 && currentHour < 20) {
        this.greetingMessage = `ערב טוב`;
      } else {
        this.greetingMessage = `לילה טוב`;
      }
     
  console.log('this.greetingMessage',this.greetingMessage)
  }
  
  togglePasswordVisibility(){
    this.showPassword = !this.showPassword
  }
}
   