import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

// import{mor} from "../../assets/Jsons/fakePost.json"

@Injectable({
    providedIn: 'root',
  })

  export class MessageService {
    private apiUrl = '../../assets/Jsons/fakePost.json';
    readonly APIurl = 'https://telavivback-production.up.railway.app/';


    constructor(private http: HttpClient) {}



    
    
    getUserMessages2(): Observable<Message[]> {
      // Customize the endpoint and parameters according to your backend
      return this.http.get<Message[]>(this.apiUrl);
    }


    
  getUserMessages(user_id: any) {
    console.log('user_id from get massegse',user_id)
    const url =  this.APIurl + 'get_all_user_messages/';
    // let queryParams = {user_id:user_id}
      // return this.http.get<any[]>(url,queryParams);
      return this.http.get<any>(url, { params: { user_id: user_id.toString() } })
    }

    MarkAsRead(message_id: any): Observable<any>{
      console.log('message_id from MarkAsRead',message_id)
      const body  = { message_id: message_id };
      console.log('queryParams.post_id',body)
      const url =  this.APIurl + 'update_read_status/';
      return this.http.put(url, body );
    }

    deleteMessage(message_id: any) {
      const url = this.APIurl + 'delete_message/';
      const queryParams = { message_id: message_id};
      console.log('queryParams',queryParams)
      return this.http.delete<any[]>(url, { params: queryParams })
    }



  }