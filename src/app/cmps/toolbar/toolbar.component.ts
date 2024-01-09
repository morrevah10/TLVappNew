import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/srvices/user.service';
import { MessageService } from 'src/app/srvices/massage.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit{

  opened=false;
  isAuthenticated=false
  logedinUser:any
  @Input() unreadMessagesCount: number = 0;


  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,

  ) {  }

  ngOnInit() {
    console.log('this.unreadMessagesCount',this.unreadMessagesCount)
  console.log('toolbar initialized');
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      if (user) {
        this.logedinUser = user;
        this.isAuthenticated = true;
      }
    })
    

}
toggleMenu() {
  this.opened = !this.opened;
}

closeMenu() {
  this.opened = false;
}
}