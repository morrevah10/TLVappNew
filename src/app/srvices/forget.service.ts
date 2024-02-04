import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ForgetService {

  private response: any;
  readonly APIurl = 'https://telavivback-production.up.railway.app/';

  code='';
  email='';
  constructor(private http: HttpClient) {}


  setResponse(response: any) {
    this.response = response;
    console.log('this.response',this.response)
    const extractedInfo = this.extractCodeAndEmail(this.response);
    
    if (extractedInfo) {
      const { code, email } = extractedInfo;
      console.log('Code:', code);
      this.code=code
      console.log('Email:', email);
      this.email=email

      // Continue with the rest of your logic...
    } else {
      console.error('Unable to extract code and email from the response message.');
    }

  }

  getResponse() {
    // return this.response;
    return {code:this.code,email:this.email}
  }


  resetPassword(passwordResetData:any): Observable<any> {
    console.log('passwordResetData',passwordResetData)
    const url = this.APIurl + `reset_password/`;
    return this.http.put(url, passwordResetData);
  }


  extractCodeAndEmail(response: any): { code: string, email: string } | null {
    if (response && response.message && typeof response.message === 'string') {
      const regex = /code : (\d+) with email (\S+)/;
      const match = response.message.match(regex);
  
      if (match && match.length === 3) {
        const code = match[1];
        const email = match[2];
        return { code, email };
      }
    }
  
    console.error('Unable to extract code and email from the response message.');
    return null;
  }

}
