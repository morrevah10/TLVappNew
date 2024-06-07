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
  showPassword = false;
  errorMessage = '';
  greetingMessage = '';
  rememberMe = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private responsesService: ResponsesService
  ) {
    this.responsesService.loadTranslationDictionary();
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });

    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      const user = JSON.parse(rememberedUser);
      const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'secret-key').toString(CryptoJS.enc.Utf8);
      this.fval['email'].setValue(user.email);
      this.fval['rememberMe'].setValue(true);
      this.fval['password'].setValue(decryptedPassword);
      this.onFormSubmit();
    }

    this.setGreetingMessage();
  }

  get fval() {
    return this.loginForm.controls;
  }

  onFormSubmit(): void {
    this.errorMessage = '';
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
        this.userService.setUser(response.user);
        this.authService.login(email);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.loading = false;
        const translatedMessage = this.responsesService.translateResponse(error.error);
        this.errorMessage = translatedMessage;
      }
    );
  }

  setGreetingMessage(): void {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      this.greetingMessage = 'בוקר טוב';
    } else if (currentHour >= 12 && currentHour < 17) {
      this.greetingMessage = 'צוהריים טובים';
    } else if (currentHour >= 17 && currentHour < 20) {
      this.greetingMessage = 'ערב טוב';
    } else {
      this.greetingMessage = 'לילה טוב';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }
}
