import { Component, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from '../../srvices/massage.service';
import { UserService } from 'src/app/srvices/user.service';
import { PostService } from 'src/app/srvices/post.service';


@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.scss']
})
export class UserMessagesComponent implements OnInit {

  userId: number = 42;
  messages: Message[] = [];

  messages2=[]
  user:any;

  constructor(private messageService: MessageService,private userService: UserService,private postService:PostService) {}

  ngOnInit(): void {
    this.userService.user$.pipe(
      switchMap(user => {
        this.user = user;
        if (user && user.user_id) {
          return this.messageService.getUserMessages(user.user_id);
        } else {
          console.error('User or user ID is undefined');
          return of([]);
        }
      }),
      switchMap((messages: Message[]) => {
        const postIds = messages.map(message => message.post_id).filter(postId => postId);
        const postRequests = postIds.map(postId => this.postService.getApartmentDetails(parseInt(postId)));
        return forkJoin([of(messages), forkJoin(postRequests)]);
      })
    ).subscribe(([messages, postDetails]: [Message[], any[]]) => {
      this.messages = messages.map((message, index) => {
        return {
          ...message,
          postDetails: postDetails[index]
        };
      });
      console.log('this.messages new', this.messages); // Move the log inside the subscribe callback
    });
  }


  
  loadUserMessages(): void {
    if (this.user && this.user.user_id) {
      console.log('this.user', this.user);
      console.log('this.user.user_id', this.user.user_id);
      this.messageService.getUserMessages(this.user.user_id).subscribe((data: any) => {
        this.messages = data;
        console.log('this.messages', this.messages);
      });
    } else {
      console.error('User or user ID is undefined');
    }
  }

getPostAddress(){
  // this.postService.getApartmentDetails()
}




  markAsUnread(message: Message): void {
    // Implement logic to mark the message as unread
    console.log('Mark as Unread:', message);
  }

  deleteMessage(message: Message): void {
    // Implement logic to delete the message
    console.log('Delete:', message);
  }
  
}

// loadUserMessages(): void {
//   this.messageService.getUserMessages(this.userId).subscribe((messages) => {
//     this.messages = messages;
//     console.log('this.messages',this.messages)
//   });
// }