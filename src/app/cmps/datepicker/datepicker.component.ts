import { Component, EventEmitter, Output } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { heLocale, listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';


@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent {
  locale = 'he';
  locales = listLocales();

  colorTheme = 'theme-dark-blue';
  bsConfig?: Partial<BsDatepickerConfig>;

  selectedDate: Date | undefined;

  constructor(private localeService: BsLocaleService) {
    defineLocale('he', heLocale);
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    this.localeService.use(this.locale);
  }

  @Output() dateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  
  onDateSelected() {
    if (this.selectedDate) {
      this.dateSelected.emit(this.selectedDate);
      console.log('Selected Date:', this.selectedDate);
    }
  }
}
