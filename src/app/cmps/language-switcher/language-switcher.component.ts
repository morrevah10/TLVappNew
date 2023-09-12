import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent {
  selectedLang!: string;
  constructor(public translateService: TranslateService) {
    this.selectedLang = translateService.currentLang;
  }

  toggleLanguage() {
    this.translateService.use(this.selectedLang); 
  }
}
