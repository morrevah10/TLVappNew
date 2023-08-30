import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ImgUploadModalComponent } from '../../cmps/img-upload-modal/img-upload-modal.component';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  PersonalForm!: FormGroup;
  submittedForm: any;
  user: any;

  profilePicture: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
    });

    this.PersonalForm = this.formBuilder.group({
      user_full_name: [''],
      user_email: [''],
      user_phone: [''],
      user_id: this.user.user_id,
    });
  }

  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.PersonalForm.invalid) {
      return;
    }

    const formValue = this.PersonalForm.value;
    const payload = {
      ...formValue,
      profile_picture: this.profilePicture, // Add this field
    };

    console.log('Form data:', payload);

    console.log('this.PersonalForm.value', payload);
    this.userService.updateUserDetails(payload).subscribe(
      (response) => {
        console.log('User successfully update:', response);
      },
      (error) => {
        console.error('Error update user:', error);
      }
    );
    // this.PersonalForm.reset();
  }


  openImageUploadModal() {
    console.log('clicked!!')
    const dialogRef = this.dialog.open(ImgUploadModalComponent, {
      width: '300px',
    });

    dialogRef.componentInstance.imageSelected.subscribe((result) => {
      const imageAndUserId = {
        user_id: this.user.user_id,
        profile_image: result.base64Image,
      };
      console.log('imageAndUserId', imageAndUserId);
      this.userService.updateUserProfilePicture(imageAndUserId).subscribe(
        (response) => {
          console.log('Profile picture updated successfully:', response);
          dialogRef.close(); // Close the modal on success
        },
        (error) => {
          console.error('Error updating profile picture:', error);
          dialogRef.componentInstance.errorMessage =
            'Error updating profile picture. Please try again.'; // Set the error message
        }
      );
    });
  }

  formatUser(): string {
    return `email: ${this.user.user_email}, : ${this.user.user_full_name}, : ${this.user.user_id},:${this.user.user_phone}`;
  }
}
