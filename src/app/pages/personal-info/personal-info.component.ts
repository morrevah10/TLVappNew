import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/srvices/user.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ImgUploadModalComponent } from '../../cmps/img-upload-modal/img-upload-modal.component';
import { PostService } from 'src/app/srvices/post.service';
import { PopupComponent } from 'src/app/cmps/popup/popup.component';
import { Router } from '@angular/router';
// import {tt} from '../../../assets/img/success.png'

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
  windowWidth!: number;
  isAuthenticated: boolean = false;

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
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;

    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
    });
    this.isAuthenticated = true;

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
    this.needApproval = true;
    this.isHidden = true;
    console.log('this.isHidden', this.isHidden);
    this.aprovelText = 'האם אתה בטוח שאתה רוצה למחוק את המשתמש ?';

    this.serverResponse = true;

    if (this.isApproved) {
      console.log('delet');

      // this.modalImg = '../../../assets/img/success.png';
      // this.modalText = 'התנתקת בהצלחה';
    }

    this.userService.deleteUser(user_id).subscribe(
      (response) => {
        console.log('User successfully deleted:', response);
        // this.userService.clearUser();
        // this.router.navigate(['/login']);
        this.serverResponse = false;
        this.modalImg = '../../../assets/img/success.png';
        this.modalText = 'החשבון נמחק בהצלחה';
      },
      (error) => {
        console.error('Error delete user:', error);
        this.errorMessage = 'Error delet user: ' + error.error;
        this.serverResponse = false;
        this.modalImg = '../../../assets/img/eroor.png';
        this.modalText = 'קרתה בעיה.. נסה שוב מאוחר יותר';
      }
    );
  }

  onModalClosed(isHidden: boolean): void {
    console.log(this.isApproved);
    this.isHidden = isHidden;
    this.aprovelText = '';
    this.modalImg = '';
    this.modalText = '';
    if (this.isApproved) {
      this.userService.clearUser();
      this.router.navigate(['/login']);
    }
  }

  onAprovel(isApproved: boolean): void {
    this.isApproved = isApproved;
    console.log(this.isApproved);
  }

  logout() {
    console.log('logedout!!!');
    this.needApproval = true;
    this.aprovelText = 'האם אתה בטוח שאתה רוצה להתנתק ?';
    this.modalImg = '../../../assets/img/success.png';
    this.modalText = 'התנתקת בהצלחה';

    this.isHidden = true;
    console.log('this.isHidden', this.isHidden);
    // this.userService.clearUser()
    // this.router.navigate(['/login']);
  }
}
