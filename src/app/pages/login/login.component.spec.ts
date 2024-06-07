import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login.component';
import { UserService } from 'src/app/srvices/user.service';
import { AuthService } from 'src/app/srvices/auth.service';
import { ResponsesService } from 'src/app/srvices/responses.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let responsesService: jasmine.SpyObj<ResponsesService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['loginUser', 'setUser']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const responsesServiceSpy = jasmine.createSpyObj('ResponsesService', ['translateResponse', 'loadTranslationDictionary']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ResponsesService, useValue: responsesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    responsesService = TestBed.inject(ResponsesService) as jasmine.SpyObj<ResponsesService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();
  });

  it('should show error if form is invalid', () => {
    component.onFormSubmit();
    expect(component.errorMessage).toBe('');
    expect(component.submitted).toBe(true);
  });

  it('should call userService.loginUser and authService.login on valid form submission', () => {
    const mockResponse = { user: { email: 'test@example.com' } };
    userService.loginUser.and.returnValue(of(mockResponse));
    component.loginForm.setValue({ email: 'test@example.com', password: 'password', rememberMe: false });

    component.onFormSubmit();

    expect(userService.loginUser).toHaveBeenCalledWith('test@example.com', 'password');
    expect(authService.login).toHaveBeenCalledWith('test@example.com');
  });

  it('should handle login errors', () => {
    const errorResponse = { error: 'Invalid credentials' };
    userService.loginUser.and.returnValue(throwError(errorResponse));
    responsesService.translateResponse.and.returnValue('הכנס אישורי כניסה תקפים');

    component.loginForm.setValue({ email: 'test@example.com', password: 'password', rememberMe: false });

    component.onFormSubmit();

    expect(userService.loginUser).toHaveBeenCalledWith('test@example.com', 'password');
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('הכנס אישורי כניסה תקפים');
  });

  it('should toggle password visibility', () => {
    component.showPassword = false;
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
  });

  it('should toggle remember me', () => {
    component.rememberMe = false;
    component.toggleRememberMe();
    expect(component.rememberMe).toBe(true);
  });
});
