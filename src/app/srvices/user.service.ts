import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject, tap } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  [x: string]: any;

  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  readonly APIurl = 'https://telavivback-production.up.railway.app/';
  // readonly APIurl = 'https://main.d1h89k09g6cz4e.amplifyapp.com/';


  constructor(private http: HttpClient) {}

  loginUser(user_email: string, user_password: string) {
    const user_data = { user_email, user_password };

    return this.http.post<any>(this.APIurl + 'login/', user_data).pipe(
      tap((response) => {
        // console.log('user obj',response)
        this.setUser(response);
      })
    );
  }
  setUser(user: User) {
    // console.log(user);
    this.userSubject.next(user);
  }

  clearUser() {
    //for log out // later
    this.userSubject.next(null);
  }


  //לבדוק ולעשות עם ערן 
deleteUser(user_id: any) : Observable<any> {
  console.log('user_id',user_id)
  let queryParams = {user_id:user_id}
  console.log('queryParams',queryParams)
  const url = this.APIurl + `delete_user/`;
  return this.http.delete(url,{params:queryParams});
}



  addUser(userData: any) {
    return this.http
      .post(this.APIurl + `register/`, userData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      console.log(error);
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      console.log(error);
      errorMessage = `${error.error}`;
    }
    return throwError(errorMessage);
  }

  addPost(formData: any): Observable<any> {
    const url = this.APIurl + `add_post/`;
    // console.log('formData', formData);
    return this.http.post(url, formData);
  }

  updateUserDetails(user: any): Observable<any> {
    console.log('user', user);
    const url = this.APIurl + `change_personal_info/`;
    return this.http.put(url, user);
  }

  updateUserPassword(userData: any): Observable<any> {
    console.log('userData', userData);
    const url = this.APIurl + `change_password/`;
    return this.http.put(url, userData);
  }

  updateUserProfilePicture(data: {
    user_id: string;
    profile_image: string;
  }): Observable<any> {
    const url = `${this.APIurl}change_profile_pic/`;
    console.log('data', data);
    return this.http.put(url, data);
  }


  forgetPassword(email:string){
    console.log('email',email)
    const url = this.APIurl + 'forget_password/';
    const queryParams = { user_email: email };
    console.log('queryParams',queryParams)
    return this.http.get<any[]>(url, { params: queryParams })


  }

}
