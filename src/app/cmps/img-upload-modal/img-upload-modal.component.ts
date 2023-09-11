import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/srvices/user.service';
// import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-img-upload-modal',
  templateUrl: './img-upload-modal.component.html',
  styleUrls: ['./img-upload-modal.component.scss'],
})
export class ImgUploadModalComponent implements OnInit {
  @Output() imageSelected = new EventEmitter<{ base64Image: string }>();
  selectedImage: File | null = null;
  // dialogRef: MatDialogRef<ImgUploadModalComponent> | undefined;
  errorMessage: string | undefined; // Add this line
  user: any;


  constructor(
    public dialogRef: MatDialogRef<ImgUploadModalComponent>,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
    });
  }

  onFileChange(event: any) {
    this.selectedImage = event.target.files[0];
  }


  confirmSelection() {
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageAndUserId = {
          user_id: this.user.user_id, 
          profile_image: reader.result as string,
        };

        this.userService.updateUserProfilePicture(imageAndUserId).subscribe(
          (response) => {
            console.log('Profile picture updated successfully:', response);
            this.dialogRef!.close(); // Close the modal on success
          },
          (error) => {
            console.error('Error updating profile picture:', error);
            this.errorMessage =
              'Error updating profile picture. Please try again.'; // Set the error message
          }
        );
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  onCancelClick() {
    this.dialogRef!.close(); // Close the modal
  }
}
