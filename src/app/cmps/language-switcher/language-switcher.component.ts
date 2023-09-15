import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent {
  selectedLang!: string;
  isEnglishSelected = true;

  constructor(public translateService: TranslateService) {
    this.selectedLang = translateService.currentLang;
  }

  toggleLanguage() {
    this.selectedLang = this.isEnglishSelected ? 'en' : 'he';
    if (this.isEnglishSelected) {
      this.enFunction();
    } else {
      this.heFunction();
    }
  }

  heFunction() {
    this.translateService.use(this.selectedLang);
    console.log(this.selectedLang);
    console.log('isEnglishSelected',this.isEnglishSelected)
  }

  enFunction() {
    this.translateService.use(this.selectedLang);
    console.log(this.selectedLang);
    console.log('isEnglishSelected',this.isEnglishSelected)

  }
}
