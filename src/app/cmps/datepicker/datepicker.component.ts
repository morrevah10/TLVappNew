import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { heLocale ,listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { LanguageService } from '../../srvices/language.service';


@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
  // locale = 'he';
  locales = listLocales();
  currentLanguage = 'en'

  colorTheme = 'theme-dark-blue';
  bsConfig?: Partial<BsDatepickerConfig>;

  @Input() selectedDate: Date | null = null;
  @Output() dateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(private localeService: BsLocaleService,private languageService: LanguageService) {
    defineLocale('he', heLocale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    this.localeService.use(this.currentLanguage);
  }



  
  onDateSelected() {
    if (this.selectedDate) {
      this.dateSelected.emit(this.selectedDate);
      console.log('Selected Date:', this.selectedDate);
    }
  }



  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe((language) => {
      this.currentLanguage = language;
      console.log('this.currentLanguage',this.currentLanguage)
      if(this.currentLanguage=='he'){
        this.localeService.use(this.currentLanguage);
      }
    });
  }
}
