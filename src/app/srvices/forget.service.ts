import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ForgetService {

  private response: any;
  readonly APIurl = 'https://telavivback-production.up.railway.app/';
  constructor(private http: HttpClient) {}


  setResponse(response: any) {
    this.response = response;
  }

  getResponse() {
    return this.response;
  }


  resetPassword(passwordResetData:any): Observable<any> {
    console.log('passwordResetData',passwordResetData)
    const url = this.APIurl + `reset_password/`;
    return this.http.put(url, passwordResetData);
  }



}
