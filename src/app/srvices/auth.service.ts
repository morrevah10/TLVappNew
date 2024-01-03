// // import { Injectable } from '@angular/core';
// // import { BehaviorSubject, Observable } from 'rxjs';
// // import { HttpClient } from '@angular/common/http';
// // import { User } from '../models/user.model';
// // import { UserService } from './user.service';

// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class AuthService {

// //   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
// //   isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

// //   constructor(private http: HttpClient, private userService: UserService) {}

// //   login() {
// //     this.isAuthenticatedSubject.next(true);
// //   }

// //   logout() {
// //     this.isAuthenticatedSubject.next(false);
// //   }
// // }

// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { User } from '../models/user.model';
// import { UserService } from './user.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private adminEmail = 'morrevah10@gmail.com' ;

//   private userEmail: string | null = null;
//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
//   isAuthenticated$: Observable<boolean> =
//     this.isAuthenticatedSubject.asObservable();

//   constructor(private http: HttpClient, private userService: UserService) {}

//   getUserEmail(): string | null {
//     return this.userEmail;
//   }

//   isAuthenticated(): boolean {
//     return this.isAuthenticatedSubject.value;
//   }

//   login(userEmail: string) {
//     console.log('Setting user email:', userEmail);
//     this.userEmail = userEmail;
//     this.isAuthenticatedSubject.next(true);
//   }

//   logout() {
//     this.userEmail = null;
//     this.isAuthenticatedSubject.next(false);
//   }

//   isAdminUser(email: string): boolean {
//     if (email === this.adminEmail) {
//       console.log('is admin');
//       return true;
//     } else {
//       return false;
//     }
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
  private adminEmails: string[] = ['morrevah10@gmail.com', 'eranlevy9@gmail.com'];

  private userEmail: string | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private userService: UserService) {}

  getUserEmail(): string | null {
    return this.userEmail;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(userEmail: string) {
    console.log('Setting user email:', userEmail);
    this.userEmail = userEmail;
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    this.userEmail = null;
    this.isAuthenticatedSubject.next(false);
  }

  isAdminUser(email: string): boolean {
    return this.adminEmails.includes(email);
  }
}
