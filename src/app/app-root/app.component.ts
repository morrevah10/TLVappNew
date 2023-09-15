import { Component, OnInit } from '@angular/core';
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


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,

  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
    this.userService.user$.subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
    });
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
