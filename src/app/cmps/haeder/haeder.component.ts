import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-haeder',
  templateUrl: './haeder.component.html',
  styleUrls: ['./haeder.component.scss']
})
export class HaederComponent {
  @Input() public title='';

}
