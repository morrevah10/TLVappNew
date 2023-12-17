import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/srvices/user.service';
import { PostService } from 'src/app/srvices/post.service';
import { DialogService } from 'src/app/srvices/dialog.service';
import { Router } from '@angular/router';
import { PopupComponent } from 'src/app/cmps/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-rmy-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss'],
})
export class myPostsComponent implements OnInit {
  userPosts: any[] = [];
  currentUser!: any;
  windowWidth!: number;
  isAuthenticated: boolean = false;

  isApartmentsReady: boolean = false;

  initialPostsToShow = 3; // Number of posts to show initially
  postsToShow = this.initialPostsToShow; // Number of posts to display
  postsToLoad = 3; // Number of additional posts to load

  needApproval: boolean = false;
  aprovelText = '';
  modalImg = '';
  modalText = '';
  isHidden: boolean = false;
  isApproved = false;
  serverResponse = false;
  apartmentId: any;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      console.log('User from posts:', user);
      this.currentUser = user;

      this.windowWidth = window.innerWidth;
      this.isAuthenticated = true;

      if (this.currentUser) {
        this.loadUserPosts();
        console.log('User ID:', this.currentUser.user_id);
      }
    });
  }
  private loadUserPosts() {
    this.postService
      .getUserPosts(this.currentUser.user_id)
      .subscribe((posts) => {
        console.log('User Posts:', posts);
        this.userPosts = posts || []; 
        this.isApartmentsReady = true;
      });
  }

  loadMorePosts() {
    this.postsToShow += this.postsToLoad;
  }

  viewApartmentDetails(apartmentId: number) {
    this.router.navigate(['/apartment', apartmentId]);
  }

  editApartmentDetails(post_id: any) {
    console.log('apartment', post_id);
    console.log('apartment.apartment_id', post_id);

    this.router.navigate(['/apartment/edit/', post_id]);
  }

  deletePost(apartmentId: any, user_id: number) {
    // Open the confirmation dialog
    // const dialogRef = this.dialogService.openConfirmationDialog(apartmentId);

    this.needApproval = true;
    this.isHidden = true;
    console.log('this.isHidden', this.isHidden);
    this.aprovelText = 'האם אתה בטוח שאתה רוצה למחוק את חוות הדעת שלך ?';

    this.serverResponse = true;
    this.apartmentId=apartmentId;

    console.log('apartmentId', apartmentId);



  }

  
  

  onModalClosed(isHidden: boolean): void {
    console.log(this.isApproved);
    this.isHidden = isHidden;
    this.aprovelText = '';
    this.modalImg = '';
    this.modalText = '';
    if (this.isApproved) {
      // this.userService.clearUser();
      // this.router.navigate(['/login']);
    }
  }

  onAprovel(isApproved: boolean): void {
    this.isApproved = isApproved;
    console.log(this.isApproved);
    if(this.isApproved){
      this.postService
        .deletePost(this.apartmentId, this.currentUser.user_id)
        .subscribe(
          (response) => {
            console.log('Delete successful', response);
            this.serverResponse = false;
            this.modalImg = '../../../assets/img/success.png';
            this.modalText = 'חוות הדעת נמחקה בהצלחה';
          },
          (error) => {
            console.error('Error deleting post', error);
            this.serverResponse = false;
            this.modalImg = '../../../assets/img/eroor.png';
            this.modalText = 'קרתה בעיה.. נסה שוב מאוחר יותר';
          }
        );
    
    }
    this.removePost(this.apartmentId)
  }

  editCommit(apartmentId: number, user_id: number) {
    console.log('apartmentId', apartmentId);
    console.log('user_id', user_id);
    // this.postService.editPostDescreption(apartmentId,user_id)
  }

  removePost(apartmentId: number) {
    const index = this.userPosts.findIndex(
      (post) => post.post_id === apartmentId
    );
    if (index !== -1) {
      this.userPosts.splice(index, 1);
      console.log('Post removed from the array');
    } else {
      console.log('Post not found in the array');
    }
  }

  displaySuccessMessage(message: string) {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        message: message,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      // Do something after the success message dialog closes, if needed.
    });
  }

  displayInfoMessage(message: string) {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        message: message,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      // Do something after the info message dialog closes, if needed.
    });
  }
}
