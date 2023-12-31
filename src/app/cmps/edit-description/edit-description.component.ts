import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from 'src/app/srvices/post.service';
import { Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/srvices/user.service';

@Component({
  selector: 'app-edit-description',
  templateUrl: './edit-description.component.html',
  styleUrls: ['./edit-description.component.scss'],
})
export class EditDescriptionComponent implements OnInit {
  apartmentId!: number;
  apartmentData: any;
  errorMessage!: '';
  isButtonDisabled : boolean = true
  windowWidth!: number;
  user: any;
  isAuthenticated: boolean = false;
  isOpinionEditable: boolean = true;


  showGallery: boolean = false;
  galleryImages: string[] = [];

  needApproval: boolean = false;
  aprovelText = '';
  modalImg = '';
  modalText = '';
  isHidden: boolean = false;
  isApproved = false;
  serverResponse = false;



  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,

  ) {

  }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;

    this.userService.user$
    .subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
    });
    this.isAuthenticated = true;

    
    const idParam = this.route
    .snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.apartmentId = +idParam;
      console.log('this.apartmentId', this.apartmentId);

      this.apartmentData = this.postService.getApartmentDetails(
        this.apartmentId
      ).subscribe((data) => {
        console.log('this.apartmentData', data);
        this.apartmentData = data;
      });
    }
  }

  onSubmit() {
    this.isOpinionEditable = false;
    this.errorMessage = '';
    this.isHidden = true;
    this.serverResponse = true;
    if (this.apartmentData) {
      console.log('Form submitted:', this.apartmentData);
    }

    this.postService.updatePost(this.apartmentData).subscribe(
      (response) => {
        console.log('Post updated successfully:', response);
        console.log('Delete successful', response);
            this.serverResponse = false;
            this.modalImg = '../../../assets/img/success.png';
            this.modalText = 'חוות הדעת שלך התקבלה וממתינה לאישור';
      },
      (error) => {
        console.error('Error updating post:', error);
     
        console.error('Error deleting post', error);
        this.serverResponse = false;
        this.modalImg = '../../../assets/img/eroor.png';
        this.modalText = 'קרתה בעיה.. נסה שוב מאוחר יותר';
        this.errorMessage = error.error
      }
      
    );
  }

  enableButton() {
    this.isOpinionEditable = true;
    this.isButtonDisabled = false;
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

  openGallery() {
    this.galleryImages = [
      this.apartmentData.apartment_pic_1,
      this.apartmentData.apartment_pic_2,
      this.apartmentData.apartment_pic_3,
      this.apartmentData.apartment_pic_4,
    ];
    this.showGallery = true;
  }

  closeGallery() {
    this.showGallery = false;
  }

  updateImg(){
    console.log('update')
    console.log('apartmentId',this.apartmentId)
    this.router.navigate(['/image-page', this.apartmentId]);
  }

}

  
