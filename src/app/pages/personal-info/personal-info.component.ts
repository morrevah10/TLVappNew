import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  PersonalForm!: FormGroup;
  submittedForm: any;
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private http: HttpClient
  ) {this.PersonalForm = this.formBuilder.group({
    user_full_name: [''],
    user_email: [''],
    user_phone: [''],
  });}


  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
    });
  }





  onSubmit() {
    if (this.PersonalForm.invalid) {
      return;
    }
    this.userService.updateUserDetails(this.PersonalForm.value).subscribe(
      (response) => {
        console.log('User successfully update:', response);
      },
      (error) => {
        console.error('Error update user:', error);
      }
    );
    this.PersonalForm.reset();
  }
}
