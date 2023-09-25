import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { HttpClient } from '@angular/common/http';
import { PopupComponent } from 'src/app/cmps/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-chang-password',
  templateUrl: './chang-password.component.html',
  styleUrls: ['./chang-password.component.scss']
})
export class ChangPasswordComponent implements OnInit{
    changePassForm!: FormGroup;
    user: any;
  showPasswordConfirmation=false
  showPassword=false
  submitted=false
  errorMessage:string =''
  loading= false
  windowWidth!: number;
  isAuthenticated: boolean =false;


  
    constructor(
      private formBuilder: FormBuilder,
      private userService: UserService,
      private http: HttpClient,
      private dialog: MatDialog,
    ) {
      
    }
    
    ngOnInit(): void {
      this.userService.user$.subscribe((user) => {
        console.log('User updated:', user);
        this.user = user;

        this.windowWidth = window.innerWidth;
        this.isAuthenticated = true;

        this.changePassForm = this.formBuilder.group({
          old_password:[''],
          new_password: [''],
          new_password_confirm: [''],
          user_id : [this.user.user_id]
        });
      });
    }
  
    
    onSubmit() {
      if (this.changePassForm.invalid) {
        return;
      }
      this.loading=true;
      this.userService.updateUserPassword(this.changePassForm.value).subscribe(
        (response) => {
          console.log('password successfully update:', response);


          const dialogRef = this.dialog.open(PopupComponent, {
            data: {
              message: 'User successfully update!'
            }
          });
          dialogRef.afterClosed()

        },
        (error) => {
          console.error('Error update password:', error);
          this.errorMessage = 'Error updating post: ' + error.error;
          this.loading=false;

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
      togglePasswordConfirmationVisibility(){
        this.showPasswordConfirmation = !this.showPasswordConfirmation;
      }
  
     
    }
