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
  needApproval: boolean = false;
  aprovelText = '';
  modalImg = '';
  modalText = '';
  isHidden: boolean = false;
  isApproved = false;
  serverResponse = false;

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


logout() {
  console.log('logedout!!!');
  // this.authService.logout().subscribe(() => {
    this.needApproval = true;
    this.aprovelText = 'האם אתה בטוח שאתה רוצה להתנתק?';
    this.modalImg = '../../../assets/img/success.png';
    this.modalText = 'התנתקת בהצלחה';

    this.isHidden = true;
  // });
}

onModalClosed(isHidden: boolean): void {
  this.authService.logout().subscribe(() => {
  console.log('this.isApproved',this.isApproved);
  this.isHidden = isHidden;
  this.aprovelText = '';
  this.modalImg = '';
  this.modalText = '';

  if (this.isApproved) {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }
});

}

onAprovel(isApproved: boolean): void {
  this.isApproved = isApproved;
  console.log(this.isApproved);
}

}
