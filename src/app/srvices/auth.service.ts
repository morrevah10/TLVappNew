// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { User } from '../models/user.model';
// import { UserService } from './user.service';



// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {

//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
//   isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

//   constructor(private http: HttpClient, private userService: UserService) {}

//   login() {
//     this.isAuthenticatedSubject.next(true);
//   }

//   logout() {
//     this.isAuthenticatedSubject.next(false);
//   }
// }
  

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private userService: UserService) {}

  
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  
  login() {
    this.isAuthenticatedSubject.next(true);
  }

  
  logout() {
    this.isAuthenticatedSubject.next(false);
  }
}
