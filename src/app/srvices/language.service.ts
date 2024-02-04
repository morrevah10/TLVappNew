import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('en'); // Initial language

  get currentLanguage$() {
    return this.languageSubject.asObservable();
  }

  setLanguage(language: string) {
    this.languageSubject.next(language);
  }
}
