import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/srvices/user.service';
import { PostService } from 'src/app/srvices/post.service';
import { DialogService } from 'src/app/srvices/dialog.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-rmy-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss'],
})
export class myPostsComponent implements OnInit {
  userPosts!: any[];
  currentUser!: any;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private dialogService: DialogService,

  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      console.log('User from posts:', user);
      this.currentUser = user;

      
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
        this.userPosts = posts;
      });
  }

  
  viewApartmentDetails(apartmentId: number) {
    this.router.navigate(['/apartment', apartmentId]);
  }


  editApartmentDetails(post_id : any){
    console.log('apartment',post_id)
    console.log('apartment.apartment_id',post_id
    )

    this.router.navigate(['/apartment/edit/', post_id
  ]);
  }




  deletePost(apartmentId: number) {
    // Open the confirmation dialog
    const dialogRef = this.dialogService.openConfirmationDialog(apartmentId);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        // User confirmed deletion, proceed with deletion
        console.log('apartmentId', apartmentId);
        this.postService.deletePost(apartmentId).subscribe(
          (response: any) => {
            console.log('Delete successful', response);
            this.removePost(apartmentId);
          },
          (error) => {
            console.error('Error deleting post', error);
          }
        );
      }
    });
  }
  
  

  editCommit(apartmentId: number,user_id:number){
    console.log('apartmentId',apartmentId)
    console.log('user_id',user_id)
    // this.postService.editPostDescreption(apartmentId,user_id)
  }

  removePost(apartmentId: number) {
    const index = this.userPosts.findIndex((post) => post.post_id === apartmentId);
    if (index !== -1) {
      this.userPosts.splice(index, 1);
      console.log('Post removed from the array');
    } else {
      console.log('Post not found in the array');
    }
  }
  



}

// getUserPosts
