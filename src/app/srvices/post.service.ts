import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class PostService {
//   [x: string]: any;

  readonly APIurl = 'https://telavivback-production.up.railway.app/';

  constructor(private http: HttpClient) {}


  addPost(formData: any): Observable<any> {
    const url = this.APIurl + `add_post/`;
    // console.log('formData', formData);
    return this.http.post(url, formData);
  }


  getApartmentPosts(): Observable<any[]> {
    const url = this.APIurl + `feed_posts/`;
    return this.http.get<any[]>(url);
  }

  getApartmentDetails(post_id: number): Observable<any> {
    console.log('post_id',post_id)
    const url = this.APIurl +`get_post/`
    return this.http.post<any>(url,post_id);
  }





  //! save to local only for check
  savePostsToLocal(posts: any[]): void {
    localStorage.setItem('apartmentPosts', JSON.stringify(posts));
  }

  getPostsFromLocal(): any[] {
    const storedPosts = localStorage.getItem('apartmentPosts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  }
}

