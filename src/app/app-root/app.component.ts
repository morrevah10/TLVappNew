import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../srvices/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/srvices/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'TLVapp';
  currentUser: User | null = null;
  opened = false;
  isAuthenticated = false;
  user: any;
  windowWidth!: number;
  isSmallScreen!: boolean;
  sidenavContainerClass!: string ;



  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,

  ) { }

  // @HostListener('window:resize', ['$event'])
  // onResize(event: Event | null): void {
  //   this.windowWidth = event?.target?.innerWidth;    this.checkWindowWidth();
  //   this.sidenavContainerClass = this.calculateSidenavContainerClass();

  // }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
    this.isSmallScreen = this.windowWidth <= 567;
    this.sidenavContainerClass = this.calculateSidenavContainerClass();
  }

 

  calculateSidenavContainerClass() {
    if (this.windowWidth <= 567 && this.isAuthenticated) {
      return 'mobile-auth-sidenav-container';
    } else {
      return 'default-sidenav-container';
    }
  }
  
  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
    });
    this.windowWidth = window.innerWidth;
    this.isSmallScreen = this.windowWidth <= 567;
    this.sidenavContainerClass = this.calculateSidenavContainerClass();
  }
  onLogoClicked() {
    if(this.user){
      this.router.navigate(['/home']);
    }
    else{
      this.router.navigate(['/login']);
    }
  }
}
