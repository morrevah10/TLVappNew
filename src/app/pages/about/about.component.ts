import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/srvices/user.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  windowWidth!: number;
  user: any;
  isAuthenticated: boolean = false;


  constructor(
    private userService: UserService,
  ) {}



  ngOnInit() {
    this.windowWidth = window.innerWidth;

    this.userService.user$
    .subscribe((user) => {
      console.log('User updated:', user);
      this.user = user;
    });
    this.isAuthenticated = true;
  }


}
