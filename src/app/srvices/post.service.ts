import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class PostService {


  readonly APIurl = 'https://telavivback-production.up.railway.app/';

  constructor(private http: HttpClient) {}


  addPost(formData: any): Observable<any> {
    console.log('formData',formData)
    const url = this.APIurl + `add_post/`;
    return this.http.post(url, formData);
  }



  getApartmentPosts(): Observable<any[]> {
    const url = this.APIurl + 'feed_posts/';
    console.log('old function works',)
    return this.http.get<any[]>(url);
  }
  
  getApartmentFilteredPosts(searchData: { post_city: string; post_street: string; post_apartment_number: string;post_building_number:string }): Observable<any[]> {
    const url = this.APIurl + 'get_post_by_parm/';
    let queryParams = searchData
    console.log('searchData new',searchData)
    return this.http.get<any[]>(url,{params:queryParams});
  }




  getApartmentDetails(post_id: number): Observable<any> {
    console.log('post_id', post_id);
    const url = `${this.APIurl}get_post/`;
    return this.http.get<any>(url, { params: { post_id: post_id.toString() } });
  }




  getUserPosts(user_id: any){
    console.log('user_id',user_id)
    const url =  this.APIurl + 'get_post_by_user_id/';
    let queryParams = {user_id:user_id}
    console.log('searchData new',queryParams.user_id)
    return this.http.get<any[]>(url,{params:queryParams});
  }

  getProfileImg(user_id: any){
    console.log('user_id',user_id)
    const url =  this.APIurl + 'get_profile_pic/';
    let queryParams = {user_id:user_id}
    console.log('searchData new',user_id)
    console.log('searchData new',queryParams)
    return this.http.get<any[]>(url,{params:queryParams});
  }





  deletePost(apartmentId: any,user_id : any) {
    const url = this.APIurl + 'delete_post/';
    const queryParams = { post_id: apartmentId ,user_id :user_id };
    console.log('queryParams',queryParams)
  
    return this.http.delete<any[]>(url, { params: queryParams })
  }



  updatePost(updatedData: any): Observable<any> {
    console.log('updatedData',updatedData)
    const body  = { post_id: updatedData.post_id , post_description:updatedData.post_description};
    console.log('queryParams.post_id',body .post_id)
    console.log('queryParams.post_description',body .post_description)
    const url = this.APIurl + `update_description_post/`;
    return this.http.put(url, body );
  }



  getPostsNotConfirmed(){
    const url = this.APIurl + 'get_all_posts_zero_status/';
    console.log(' function works')
    return this.http.get<any[]>(url);
  }

  updateConfirmStatus(update:any): Observable<any>{
    const url = this.APIurl+'update_confirm_status/'
    const queryParams = { post_id:update.post_id  ,user_id:update.user_id ,confirm_status:update.confirm_status };
    console.log(' update works')
    console.log('queryParams',queryParams)
    return this.http.post(url, queryParams)
   
  }


  








}

