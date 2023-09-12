import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ImgUploadModalComponent } from '../../cmps/img-upload-modal/img-upload-modal.component';
import { PostService } from 'src/app/srvices/post.service';
import { PopupComponent } from 'src/app/cmps/popup/popup.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  PersonalForm!: FormGroup;
  submittedForm: any;
  user: any;
  userImg: any = '';
  errorMessage: string = '';

  profilePicture: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private http: HttpClient,
    private dialog: MatDialog,
    private postService: PostService,
    private router: Router
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

    //function
    if (this.user) {
      this.loadUserImg(this.user.user_id);
      console.log('this.user.user_id', this.user.user_id);
    } else {
      console.log('problemmm');
    }
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

        const dialogRef = this.dialog.open(PopupComponent, {
          data: {
            message: 'User successfully update!',
          },
        });
        dialogRef.afterClosed();
      },
      (error) => {
        console.error('Error update user:', error);
        this.errorMessage = 'Error updating post: ' + error.error;
      }
    );
    // this.PersonalForm.reset();
  }

  openImageUploadModal() {
    console.log('clicked!!');
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

  loadUserImg(user_id: any) {
    this.postService.getProfileImg(user_id).subscribe((img) => {
      console.log('User Posts:', img);
      this.userImg = img;
    });
  }

  deleteUser(user_id: any) {
    console.log('user_id', user_id);
    this.userService.deleteUser(user_id).subscribe(
      (response) => {
        console.log('User successfully deleted:', response);
        this.userService.clearUser()
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error delete user:', error);
        this.errorMessage = 'Error delet user: ' + error.error;
      }
    );
  
}


logout(){
  console.log('logedout!!!');
  this.userService.clearUser()
  this.router.navigate(['/login']);}

  
}

