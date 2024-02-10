import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../srvices/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/srvices/user.service';
import { MessageService } from '../srvices/massage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  currentUser: User | null = null;
  isAuthenticated = false;
  user: any;
  unreadMessagesCount = 0;


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService

  ) { }

  // ngOnInit() {
  //   console.log("app root")
  //   this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
  //     this.isAuthenticated = isAuthenticated;
  //     if (isAuthenticated) {
  //       this.userService.user$.subscribe((user) => {
  //         if (user && user.user_id) {
  //           const userId: number = +user.user_id;
  
  //           this.messageService.getUserMessages(userId).subscribe((messages) => {
  //             this.unreadMessagesCount = this.countUnreadMessages(messages);
  //             console.log('Unread messages count:', this.unreadMessagesCount);
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

  ngOnInit() {
    console.log("app root")
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.userService.user$.subscribe((user) => {
          if (user && user.user_id) {
            const userId: number = +user.user_id;
  
            this.messageService.getUserMessages(userId).subscribe((messages) => {
              console.log('messages',messages)
              this.unreadMessagesCount = this.countUnreadMessages(messages);
              console.log('Unread messages count:', this.unreadMessagesCount);
            });
  
            // Listen for changes in unread messages count
            this.messageService.unreadMessagesCount$.subscribe((count) => {
              this.unreadMessagesCount = count;
            });
          }
        });
      }
    });
  }

countUnreadMessages(messages: any[]): number {
  let updatedUnreadCount = messages.filter(message => message.read_status === '0').length;
  this.messageService.updateUnreadMessagesCount(updatedUnreadCount);
  return updatedUnreadCount 
}




}