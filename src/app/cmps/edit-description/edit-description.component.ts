import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from 'src/app/srvices/post.service';
import { Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';



// import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-edit-description',
  templateUrl: './edit-description.component.html',
  styleUrls: ['./edit-description.component.scss'],
})
export class EditDescriptionComponent implements OnInit {
  // editForm: FormGroup;
  apartmentId!: number;
  apartmentData: any;
  errorMessage!: '';
  isButtonDisabled : boolean = true

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private dialog: MatDialog,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
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
    this.errorMessage = '';
    if (this.apartmentData) {
      // handle the form submission here
      console.log('Form submitted:', this.apartmentData);
    }

    this.postService.updatePost(this.apartmentData).subscribe(
      (response) => {
        console.log('Post updated successfully:', response);
        
        const dialogRef = this.dialog.open(PopupComponent, {
          data: {
            message: 'Post updated successfully!'
          }
        });

        // Navigate to 'myposts' after the dialog closes
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['myposts']);
        });
      },
      (error) => {
        console.error('Error updating post:', error);
        const dialogRef = this.dialog.open(PopupComponent, {
          data: {
            message: 'Error updating post: ' + error.error
          }
          
        });
        this.errorMessage = error.error
      }
      
    );
  }

  enableButton() {
    console.log('click')
    this.isButtonDisabled = false;
  }
}

  
// this.errorMessage = 'Error updating post: ' + error.error;