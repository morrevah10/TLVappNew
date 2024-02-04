import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
// import {json} from '../../assets/i18/'

@Injectable()
export class TranslateLoaderImpl extends TranslateLoader {

    constructor(private http: HttpClient) {
      super();
    }
  
    load(lang: string) {
      return this.http.get(`../../assets/i18/${lang}.json`);
    }

    getTranslation(lang: string) {
        return this.http.get(`../../assets/i18/${lang}.json`);
    }
  }