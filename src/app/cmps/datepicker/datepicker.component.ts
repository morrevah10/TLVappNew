// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
// import { heLocale ,listLocales } from 'ngx-bootstrap/chronos';
// import { defineLocale } from 'ngx-bootstrap/chronos';
// import { LanguageService } from '../../srvices/language.service';


// @Component({
//   selector: 'app-datepicker',
//   templateUrl: './datepicker.component.html',
//   styleUrls: ['./datepicker.component.scss'],
// })
// export class DatepickerComponent implements OnInit {
//   // locale = 'he';
//   locales = listLocales();
//   currentLanguage = 'he'

//   colorTheme = 'theme-dark-blue';
//   bsConfig?: Partial<BsDatepickerConfig>;

//   @Input() selectedDate: Date | null = null;
//   @Output() dateSelected: EventEmitter<Date> = new EventEmitter<Date>();

//   constructor(private localeService: BsLocaleService,private languageService: LanguageService) {
//     defineLocale('he', heLocale);
//     this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
//     this.localeService.use(this.currentLanguage);
//   }



  
//   onDateSelected() {
//     if (this.selectedDate) {
//       this.dateSelected.emit(this.selectedDate);
//       console.log('Selected Date:', this.selectedDate);
//     }
//   }



//   ngOnInit(): void {
//     this.languageService.currentLanguage$.subscribe((language) => {
//       this.currentLanguage = language;
//       console.log('this.currentLanguage',this.currentLanguage)
//       if(this.currentLanguage=='he'){
//         this.localeService.use(this.currentLanguage);
//       }
//     });
//   }
// }

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { heLocale, listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { LanguageService } from '../../srvices/language.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
  locales = listLocales();
  currentLanguage = 'he';
  colorTheme = 'theme-dark-blue';
  bsConfig?: Partial<BsDatepickerConfig>;

  @Input() selectedDate: Date | null = null;
  @Output() dateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  selectedDay: string = (new Date().getDate()).toString();  
  selectedMonth: string = (new Date().getMonth() + 1).toString();  
  selectedYear: number = new Date().getFullYear();  

  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months: { name: string; value: string }[] = [
    { name: 'ינואר', value: '1' },
    { name: 'פברואר', value: '2' },
    { name: 'מרץ', value: '3' },
    { name: 'אפריל', value: '4' },
    { name: 'מאי', value: '5' },
    { name: 'יוני', value: '6' },
    { name: 'יולי', value: '7' },
    { name: 'אוגוסט', value: '8' },
    { name: 'ספטמבר', value: '9' },
    { name: 'אוקטובר', value: '10' },
    { name: 'נובמבר', value: '11' },
    { name: 'דצמבר', value: '12' },
    
  ];
  years: number[] = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i);

  constructor(private localeService: BsLocaleService, private languageService: LanguageService) {
    defineLocale('he', heLocale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    this.localeService.use(this.currentLanguage);
  }

  onDateSelected() {
    const date = new Date(`${this.selectedYear}-${this.selectedMonth}-${this.selectedDay}`);
    this.dateSelected.emit(date);
    console.log('Selected Date:', date);
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe((language) => {
      this.currentLanguage = language;
      if (this.currentLanguage == 'he') {
        this.localeService.use(this.currentLanguage);
      }
    });
  }
}
