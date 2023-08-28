import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../srvices/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TLVapp';
  currentUser!: User;
  opened=false;


  constructor(
    private router: Router,
    private AuthService: AuthService
    ) {
   
    }
     
}
