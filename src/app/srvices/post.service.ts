import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class PostService {
//   [x: string]: any;

  readonly APIurl = 'https://telavivback-production.up.railway.app/';

  constructor(private http: HttpClient) {}


  addPost(formData: any): Observable<any> {
    const url = this.APIurl + `add_post/`;
    return this.http.post(url, formData);
  }



  getApartmentPosts(): Observable<any[]> {
    const url = this.APIurl + 'feed_posts/';
    console.log('old function works',)
    // Use the responseType option to specify the expected response type
    return this.http.get<any[]>(url);
  }
  
  getApartmentFilteredPosts(searchData: { post_city: string; post_street: string; post_apartment_number: string; }): Observable<any[]> {
    const url = this.APIurl + 'get_post_by_parm/';
    let queryParams = searchData
    console.log('searchData new',searchData)
    // Use the responseType option to specify the expected response type
    return this.http.get<any[]>(url,{params:queryParams});
  }




  getApartmentDetails(post_id: number): Observable<any> {
    console.log('post_id', post_id);
    const url = `${this.APIurl}get_post/`;
    return this.http.get<any>(url, { params: { post_id: post_id.toString() } });
  }





  //! save to local only for check
  // savePostsToLocal(posts: any[]): void {
  //   localStorage.setItem('apartmentPosts', JSON.stringify(posts));
  // }

  // getPostsFromLocal(): any[] {
  //   const storedPosts = localStorage.getItem('apartmentPosts');
  //   return storedPosts ? JSON.parse(storedPosts) : [];
  // }
}

