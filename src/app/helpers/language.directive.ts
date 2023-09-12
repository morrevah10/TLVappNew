import { Directive, Input, OnChanges, SimpleChanges, Renderer2, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[appLanguage]'
})
export class LanguageDirective implements OnChanges {
  @Input('appLanguage') defaultDirection: string = 'ltr'; 

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private translateService: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.translateService.currentLang === 'he') {
      // If the current language is Hebrew, set text alignment to right and direction to RTL
      this.renderer.setStyle(this.el.nativeElement, 'text-align', 'right');
      this.renderer.setStyle(this.el.nativeElement, 'direction', 'rtl');
    } else {
      // For other languages, use the default direction (e.g., 'ltr')
      this.renderer.setStyle(this.el.nativeElement, 'text-align', 'left');
      this.renderer.setStyle(this.el.nativeElement, 'direction', this.defaultDirection);
    }
  }
}
