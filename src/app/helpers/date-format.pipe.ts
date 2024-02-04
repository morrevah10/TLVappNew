import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    const day = this.padWithZero(date.getDate().toString());
    const month = this.padWithZero((date.getMonth() + 1).toString());
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private padWithZero(num: string): string {
    return num.length === 1 ? `0${num}` : num;
  }
}
