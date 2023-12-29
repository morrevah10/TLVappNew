import { Component, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { MessageService } from '../../srvices/massage.service';
import { UserService } from 'src/app/srvices/user.service';


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

  constructor(private messageService: MessageService,private userService: UserService,) {}

  ngOnInit(): void {
    
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
      // console.log('this.user1111111111',this.user)
    });
    this.loadUserMessages();
  }

  
  loadUserMessages(): void {
    console.log('this.user',this.user)
    console.log('this.user.user_id',this.user.user_id)
    this.messageService.getUserMessages(this.user.user_id).subscribe((data:any) => {
    //   // this.messages = data.Updates;
      this.messages = data
      console.log('this.messages',this.messages)
    });
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