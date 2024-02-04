import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { HttpClient } from '@angular/common/http';
import { PopupComponent } from 'src/app/cmps/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResponsesService } from 'src/app/srvices/responses.service';

@Component({
  selector: 'app-chang-password',
  templateUrl: './chang-password.component.html',
  styleUrls: ['./chang-password.component.scss'],
})
export class ChangPasswordComponent implements OnInit {
  changePassForm!: FormGroup;
  user: any;
  showPasswordConfirmation = false;
  showPassword = false;
  submitted = false;
  errorMessage: string = '';
  loading = false;
  windowWidth!: number;
  isAuthenticated: boolean = false;

  showPasswordTooltip: boolean = false;

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
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private responsesService: ResponsesService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;

      this.windowWidth = window.innerWidth;
      this.isAuthenticated = true;

      this.changePassForm = this.formBuilder.group({
        old_password: ['', Validators.required],
        new_password: ['', Validators.required],
        new_password_confirm: ['', Validators.required],
        user_id: [this.user.user_id],
      });
    });
  }

  onSubmit() {
    if (this.changePassForm.invalid) {
      return;
    }
    this.isHidden = true;
    this.serverResponse = true;
    this.loading = true;
    this.userService.updateUserPassword(this.changePassForm.value).subscribe(
      (response) => {
        console.log('password successfully update:', response);
        this.serverResponse = false;
        this.modalImg = '../../../assets/img/success.png';
        this.modalText = 'הסיסמא עודכנה בהצלחה';

        setTimeout(() => {
          this.router.navigate(['/personalInfo']);
        }, 2500);
      },
      (error) => {
        console.error('Error update password:', error);
        // this.errorMessage = 'Error updating post: ' + error.error;
        const translatedMessage = this.responsesService.translateResponse(
          error.error
        );

        this.loading = false;
        this.serverResponse = false;
        this.modalImg = '../../../assets/img/eroor.png';
        this.modalText = translatedMessage;
      }
    );
    this.changePassForm.patchValue({
      old_password: '',
      new_password: '',
      new_password_confirm: '',
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordConfirmationVisibility() {
    this.showPasswordConfirmation = !this.showPasswordConfirmation;
  }

  onModalClosed(isHidden: boolean): void {
    console.log(this.isApproved);
    this.isHidden = isHidden;
    this.aprovelText = '';
    this.modalImg = '';
    this.modalText = '';
    if (this.isApproved) {
    }
  }

  onAprovel(isApproved: boolean): void {
    this.isApproved = isApproved;
    console.log(this.isApproved);
  }

  toggleToolTipVisibility() {
    this.showPasswordTooltip = true;
    console.log('tooltip', this.showPasswordTooltip);

    setTimeout(() => {
      this.showPasswordTooltip = false;
      console.log('tooltip', this.showPasswordTooltip);
    }, 3500);
  }
}
