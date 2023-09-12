import { Component, OnInit } from '@angular/core';
import { AuthService } from '../srvices/auth.service';
import { User } from '../models/user.model';


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



  constructor(private authService: AuthService,
    ) {
    }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
  }


 
}
