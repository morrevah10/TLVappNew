import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ResponsesService {
  private translationDictionary: any;


  constructor(private http: HttpClient) { 
    this.loadTranslationDictionary();
  }



   loadTranslationDictionary() {
    this.http
      .get('../../assets/Jsons/responses.json') 
      .pipe(
        map((data) => (this.translationDictionary = data,console.log('data',data))),
        catchError((error) => {
          console.error('Error loading translation dictionary', error);
          return of(null);
        })
      )
      .subscribe();
  }


  translateResponse(responseKey: string): string {
    if (this.translationDictionary && this.translationDictionary.responses) {
      return this.translationDictionary.responses[responseKey] || responseKey;
    } else {
      return responseKey;
    }
  }


}
