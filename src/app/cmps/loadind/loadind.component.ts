import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-loadind',
  templateUrl: './loadind.component.html',
  styleUrls: ['./loadind.component.scss']
})


export class LoadindComponent {

  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigate(['/welcom']);
    }, 3500); // Navigate after 3 seconds (adjust the delay as needed)
  }

}
