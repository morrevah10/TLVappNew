import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chang-password',
  templateUrl: './chang-password.component.html',
  styleUrls: ['./chang-password.component.scss']
})
export class ChangPasswordComponent implements OnInit{
    changePassForm!: FormGroup;
    // PersonalForm!: FormGroup;
    // submittedForm: any;
    user: any;
  // PersonalForm: any;
  showPasswordConfirmation=false
  showPassword=false
  submitted=false

  
    constructor(
      private formBuilder: FormBuilder,
      private userService: UserService,
      private http: HttpClient
    ) {
      
    }
    
    ngOnInit(): void {
      this.userService.user$.subscribe((user) => {
        console.log('User updated:', user);
        this.user = user;

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
      this.userService.updateUserPassword(this.changePassForm.value).subscribe(
        (response) => {
          console.log('password successfully update:', response);
        },
        (error) => {
          console.error('Error update password:', error);
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
