import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opening',
  templateUrl: './opening.component.html',
  styleUrls: ['./opening.component.scss']
})
export class OpeningComponent {

  isSkiped = false

  stages = [
    {
      imageUrl: '../../../assets/img/open1.png',
      title: 'ברוכים הבאים לRent Share',
      text: 'המקום שיעזור לכם לצמצם את האי וודאות לפני השכרת דירה חדשה'
    },
    {
      imageUrl: '../../../assets/img/open2.png',
      title: 'מחפשים להשכיר בית וידועה לכם הכתובת ?',
      text: 'במסך הבית תוכלו לחפש מה אמרו דיירים קודמים על הדירה'
    },
    {
      imageUrl: '../../../assets/img/open3.png',
      title: 'רוצים לעזור להגדיל את הקהילה ?',
      text: 'אם סיימתם חוזה ואתם רוצים לעזור לאחרים לחצו על כפתור שתף את החויה שלך במסך הבית'
    }
  ];

  currentStage = 0;

  constructor(private router: Router) {}

  nextStage() {
    console.log(this.currentStage)
    if (this.currentStage < this.stages.length - 1) {
      this.currentStage++;
    }
    console.log(this.currentStage)
  }

  previousStage() {
    if (this.currentStage > 0) {
      this.currentStage--;
    }
  }

  skipToLogin() {
    // Navigate to the login page when the user clicks the Skip button
    this.router.navigate(['/login']);
    this.isSkiped = true
  }
}
