import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/srvices/user.service';
import { MessageService } from 'src/app/srvices/massage.service';
import { AuthService } from 'src/app/srvices/auth.service'; 

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  opened = false;
  isAuthenticated = false;
  logedinUser: any;
  isAdmin = false;
  @Input() unreadMessagesCount: number = 0;

  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private authService: AuthService

  ) {}

  ngOnInit() {
    console.log('this.unreadMessagesCount', this.unreadMessagesCount);
    console.log('toolbar initialized');
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      if (user) {
        this.logedinUser = user;
        this.isAuthenticated = true;
        this.isAdmin =this.checkAdmin(this.logedinUser.user_email)
      }
    });
  }
  toggleMenu() {
    this.opened = !this.opened;
  }

  closeMenu() {
    this.opened = false;
  }


checkAdmin(email:string){
  console.log('is admin :',this.authService.isAdminUser(email))
  return this.authService.isAdminUser(email)
}


}
