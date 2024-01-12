import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../models/message.model';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from '../../srvices/massage.service';
import { UserService } from 'src/app/srvices/user.service';
import { PostService } from 'src/app/srvices/post.service';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { AfterViewInit,ElementRef,  } from '@angular/core';



@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.scss'],
})
export class UserMessagesComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('stepperContainer') stepperContainer!: ElementRef;


  userId: number = 42;
  messages: Message[] = [];

  selectedPostGroup: any = null;
  selectedMessageIndex: number = 0;
  selectedStepIndex: number = 0;
  isStepperOpen: boolean = false;

  latestMessages: any[] = []; // Assuming latestMessages is an array of messages
  transformedMessages: any[] = []; // Assuming transformedMessages is an array of message groups

  messages2 = [];
  user: any;

  showFullText = false;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private postService: PostService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.userService.user$
      .pipe(
        switchMap((user) => {
          this.user = user;
          if (user && user.user_id) {
            return this.messageService.getUserMessages(user.user_id);
          } else {
            console.error('User or user ID is undefined');
            return of([]);
          }
        }),
        switchMap((messages: Message[]) => {
          const postIds = messages
            .map((message) => message.post_id)
            .filter((postId) => postId);
          const postRequests = postIds.map((postId) =>
            this.postService.getApartmentDetails(parseInt(postId))
          );
          return forkJoin([of(messages), forkJoin(postRequests)]);
        })
      )
      .subscribe(([messages, postDetails]: [Message[], any[]]) => {
        this.messages = messages.map((message, index) => {
          const postDetail = postDetails[index];
      
          return {
            ...message,
            postDetails: postDetail || {},  
            isOpen: false,
            showFullText: false,
          };
        });
        this.transformedMessages = this.groupMessagesByPostId(this.messages);
        this.latestMessages = this.transformedMessages.map((group) => group[group.length - 1]);

        console.log('this.transformedMessages', this.transformedMessages);
        console.log('this.latestMessages', this.latestMessages);
        console.log('this.messages new', this.messages);
      });
  }

  toggleText(message: Message): void {
    message.showFullText = !message.showFullText;
  }

  toggleMessage(message: Message): void {
    message.isOpen = !message.isOpen;
  }

  loadUserMessages(): void {
    if (this.user && this.user.user_id) {
      console.log('this.user', this.user);
      console.log('this.user.user_id', this.user.user_id);
      this.messageService
        .getUserMessages(this.user.user_id)
        .subscribe((data: any) => {
          this.messages = data;
          console.log('this.messages', this.messages);
        });
    } else {
      console.error('User or user ID is undefined');
    }
  }
  // toggleGroupMessages(group: Message[]): void {
  //   group.forEach(message => {
  //     message.isOpen = !message.isOpen;
  //   });
  // }

  markAsUnread(message: Message): void {
    console.log('Mark as Unread:', message);
    
    this.messageService.MarkAsRead(message).subscribe(
      (response) => {
        console.log('Post updated successfully:', response);
        const updatedUnreadCount = response.updatedUnreadCount;
        this.messageService.updateUnreadMessagesCount(updatedUnreadCount);
        this.loadUserMessages();
              },
      (error) => {
        console.error('Error updating post:', error);
      }
    );

  }

  deleteMessage(message: Message): void {
    console.log('message',message)
    console.log('Delete: message_id', message.message_id);
    this.messageService.deleteMessage(message.message_id).subscribe(
      (response) => {
        console.log('Delete successful', response);
        this.loadUserMessages();
      },
      (error) => {
        console.error('Error deleting post', error);
      }
    );

  }

  toggleReadStatus(message: any): void {
    console.log('Toggle Read Status Clicked');
    console.log('message.read_status', message.read_status)
    if (message.read_status === '0') {
      console.log('message.read_status', message.read_status)
      this.markAsUnread(message.message_id);
      message.read_status = '1';  
    } else {
      return;
    }
  }


  generateLink(message: Message): string {
    if (message.customLink) {
      return message.customLink;
    }
  
    const confirmationStatusNumber = parseInt(message.postDetails.confirmation_status, 10);
    const postIdNumber = parseInt(message.post_id, 10);
  
    console.log('confirmationStatusNumber:', confirmationStatusNumber);
    console.log('postIdNumber:', postIdNumber);

    if (isNaN(confirmationStatusNumber) || isNaN(postIdNumber)) {
      return '/messages';
    }

    if(confirmationStatusNumber==0){
      return '';
    }
  
    if (confirmationStatusNumber === 1) {
      return '/myposts';
    } else if (confirmationStatusNumber >= 2 && confirmationStatusNumber <= 5) {
      return `/post-details/${confirmationStatusNumber}/${postIdNumber}`;
    } else if (confirmationStatusNumber === 6) {
      return `/apartment/edit/${postIdNumber}`;
    } else {
      return '/messages';
    }
  }

  navigateToLink(message: Message): void {
    const link = this.generateLink(message);
    if (link !== '/messages') {
      this.router.navigate([link]);
    }
  }


  groupMessagesByPostId(messages: Message[]): any[] {
    const groupedMessages: any[] = [];
  
    messages.forEach((message) => {
      const postId = message.post_id;
  
      const index = groupedMessages.findIndex((group) => group[0]?.post_id === postId);
  
      if (index !== -1) {
        groupedMessages[index].push(message);
      } else {
        groupedMessages.push([message]);
      }
    });
  
    // Set the membersCount and position properties for each message
    groupedMessages.forEach((group) => {
      group.forEach((message: { membersCount: any; positionInGroup: any; }, index: number) => {
        message.membersCount = group.length;
        message.positionInGroup = index + 1;
      });
    });
  
    console.log('groupedMessages',groupedMessages)
    return groupedMessages;
  }

  getLastOpenStepIndex(postGroup: any[]): number {
    return postGroup.findIndex((message) => message.isOpen) || 0;
  }

  // Method to toggle the stepper and open the last step
  toggleGroupMessages(postGroup: any) {
    this.isStepperOpen = !this.isStepperOpen;
    this.selectedPostGroup = postGroup;
  }

  resetStepper(): void {
    this.selectedPostGroup = null;
    // Setting the index to -1 triggers the AfterViewInit hook
    this.stepper.selectedIndex = -1;
  }

  ngAfterViewInit(): void {
    if (this.isStepperOpen) {
      // Setting the index to the last step
      this.stepper.selectedIndex = this.selectedPostGroup.length - 1;
      // Focus on the last step header after the view has been initialized
      const lastStepHeader = this.stepperContainer.nativeElement.querySelectorAll(
        '.mat-horizontal-stepper-header-container button'
      )[this.selectedPostGroup.length - 1];
      if (lastStepHeader) {
        lastStepHeader.focus();
      }
    }
  }


}




// loadUserMessages(): void {
//   this.messageService.getUserMessages(this.userId).subscribe((messages) => {
//     this.messages = messages;
//     console.log('this.messages',this.messages)
//   });
// }
