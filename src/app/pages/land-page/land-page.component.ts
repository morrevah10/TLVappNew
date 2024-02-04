import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-land-page',
  templateUrl: './land-page.component.html',
  styleUrls: ['./land-page.component.scss']
})
export class LandPageComponent {
  windowWidth: number;
  constructor(private router: Router) {this.windowWidth = window.innerWidth;}
  // console.log(string,'click')


  goTo(destination: string): void {
    this.router.navigate([destination]);
  }
}
