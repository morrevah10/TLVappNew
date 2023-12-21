import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ImgUploadModalComponent } from '../../cmps/img-upload-modal/img-upload-modal.component';
import { PostService } from 'src/app/srvices/post.service';
import { PopupComponent } from 'src/app/cmps/popup/popup.component';
import { Router } from '@angular/router';
import { ResponsesService } from 'src/app/srvices/responses.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  PersonalForm!: FormGroup;
  submittedForm: any;
  user: any;
  initialUser: any;
  userImg: any = '';
  errorMessage: string = '';
  errorOccurred: boolean = false;
  ImgerrorMessage: string = '';
  successMessage: string = '';

  formChanged: boolean = false;

  profilePicture: string | ArrayBuffer | null = null;
  windowWidth!: number;
  isAuthenticated: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private http: HttpClient,
    private dialog: MatDialog,
    private postService: PostService,
    private router: Router,
    private responsesService:ResponsesService,
  ) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    console.log('this.formChanged',this.formChanged)

    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
      this.initialUser = { ...user };
    });
    this.isAuthenticated = true;


    this.PersonalForm = this.formBuilder.group({
      user_full_name: [this.user.user_full_name, Validators.required],
      user_email: [this.user.user_email, Validators.required],
      user_phone: [this.user.user_phone, Validators.required],
      user_id: [this.user.user_id],
    });

    //function
    if (this.user) {
      this.loadUserImg(this.user.user_id);
      console.log('this.user.user_id', this.user.user_id);
    } else {
      console.log('problemmm');
    }


    Object.keys(this.PersonalForm.controls).forEach((key) => {
      this.PersonalForm.get(key)?.valueChanges.subscribe(() => {
        this.formChanged = this.isFormChanged();
      });
    });
  }

  isFormChanged(): boolean {
    const formValue = this.PersonalForm.value;

    return (
        formValue.user_full_name !== this.initialUser.user_full_name ||
        formValue.user_email !== this.initialUser.user_email ||
        formValue.user_phone !== this.initialUser.user_phone
    );
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
    console.log('this.formChanged',this.formChanged)
    console.log('Submit button clicked');
    if (this.PersonalForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    console.log('Form is valid. Proceeding with submission...');

    const formValue = this.PersonalForm.value;

  

    const payload = {
      ...formValue,
      profile_picture: this.profilePicture,
    };

    console.log('Form data:', payload);

    console.log('this.PersonalForm.value', payload);
    this.userService.updateUserDetails(payload).subscribe(
      (response) => {
        console.log('User successfully update:', response);


        this.successMessage = 'הפרטים עודכנו בהצלחה';
        this.formChanged = false;
      },
      (error) => {
        // console.error('Error update user:', error);
        const translatedMessage = this.responsesService.translateResponse(error.error);

        this.errorMessage = translatedMessage;

        this.formChanged = false;
      }
    );
  }

  // openImageUploadModal() {
  //   console.log('clicked!!');
  //   const dialogRef = this.dialog.open(ImgUploadModalComponent, {
  //     width: '300px',
  //   });

  //   dialogRef.componentInstance.imageSelected.subscribe((result) => {
  //     const imageAndUserId = {
  //       user_id: this.user.user_id,
  //       profile_image: result.base64Image,
  //     };
  //     console.log('imageAndUserId', imageAndUserId);
  //     this.userService.updateUserProfilePicture(imageAndUserId).subscribe(
  //       (response) => {
  //         console.log('Profile picture updated successfully:', response);
  //         dialogRef.close(); // Close the modal on success
  //       },
  //       (error) => {
  //         console.error('Error updating profile picture:', error);
  //         dialogRef.componentInstance.errorMessage =
  //           'Error updating profile picture. Please try again.'; // Set the error message
  //       }
  //     );
  //   });
  // }

  onProfilePictureSelected(event: any) {
    // Handle the file input change event
    const file = event.target.files[0];

    if (file) {
      // Convert the selected image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;

        // Update the user profile picture
        const imageAndUserId = {
          user_id: this.user.user_id,
          profile_image: base64Image,
        };

        this.userService.updateUserProfilePicture(imageAndUserId).subscribe(
          (response) => {
            console.log('Profile picture updated successfully:', response);
            // update the userImg.user_profile_pic with the new image
            this.userImg.user_profile_pic = base64Image;
          },
          (error) => {
            console.error('Error updating profile picture:', error);
            // Handle error if needed
          }
        );
      };

      reader.readAsDataURL(file);
    }
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
        this.userService.clearUser();
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error delete user:', error);
        this.errorMessage = 'Error delet user: ' + error.error;
      }
    );
  }

  logout() {
    console.log('logedout!!!');
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }
}
