import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/srvices/user.service';
import { AuthService } from '../../srvices/auth.service';
import * as CryptoJS from 'crypto-js';


import { ResponsesService } from 'src/app/srvices/responses.service';



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
  rememberMe: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private responsesService:ResponsesService,

  ) {
    responsesService.loadTranslationDictionary()
  }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });

    const rememberedUser = localStorage.getItem('rememberedUser');
    console.log(rememberedUser,'rememberedUser')
    if (rememberedUser) {
      const user = JSON.parse(rememberedUser);
  
      const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'secret-key').toString(CryptoJS.enc.Utf8);
  
      this.fval['email'].setValue(user.email);
      this.fval['rememberMe'].setValue(true);
      this.fval['password'].setValue(decryptedPassword);
  
      this.onFormSubmit();
    }


    this.windowWidth = window.innerWidth;
    

    this.setGreetingMessage()

  }

  get fval() {
    console.log('this.loginForm.',this.loginForm)
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

    const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret-key').toString();

    
    if (this.rememberMe) {
    localStorage.setItem('rememberedUser', JSON.stringify({ email, password: encryptedPassword }));
  }



    this.userService.loginUser(email, password).subscribe(
      (response) => {
        console.log('response:', response);
        this.userService.setUser(response.user);
        this.authService.login(email)
        const userEmail = this.authService.getUserEmail();

        if (this.authService.isAdminUser(userEmail!)) {
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
          
        } else {
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        }
      },
      (error) => {
        this.loading = false;
        // this.submitted = false;
        console.error(error);
        // this.errorMassege= error.error
        const translatedMessage = this.responsesService.translateResponse(error.error);
        console.log(translatedMessage);
        this.errorMassege=translatedMessage
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

  toggleRememberMe() {
    this.rememberMe = !this.rememberMe;
    console.log( this.rememberMe)
  }


}
   