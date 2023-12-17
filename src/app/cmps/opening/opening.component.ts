import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opening',
  templateUrl: './opening.component.html',
  styleUrls: ['./opening.component.scss']
})
export class OpeningComponent implements OnInit{

  isSkiped = false
   
  stages = [
    {
      imageUrl: '../../../assets/img/open1.png',
      title: 'ברוכים הבאים לRent Share',
      text: 'המקום שיעזור לכם לצמצם את אי הוודאות לפני השכרת דירה חדשה'
    },
    {
      imageUrl: '../../../assets/img/open2.png',
      title: 'מחפשים להשכיר בית וידועה לכם הכתובת ?',
      text: 'במסך הבית תוכלו לבדוק מה דיירים קודמים אמרו על הדירה'
    },
    {
      imageUrl: '../../../assets/img/open3.png',
      title: 'רוצים לעזור להגדיל את הקהילה ?',
      text: 'אם סיימתם חוזה ואתם רוצים לעזור לאחרים לחצו על כפתור שתף את החוויה שלך במסך הבית'
    }
  ];

  currentStage = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
    this.router.navigate(['/login']);
    }
  }

  nextStage() {
    console.log(this.currentStage)
    if (this.currentStage < this.stages.length - 1) {
      this.currentStage++;
    }
    if(this.currentStage==2){
      localStorage.setItem('hasVisited', 'true');
    }
    console.log(this.currentStage)
  }

  previousStage() {
    if (this.currentStage > 0) {
      this.currentStage--;
    }
  }

  skipToLogin() {
    this.router.navigate(['/login']);
    this.isSkiped = true
    localStorage.setItem('hasVisited', 'true');
  }
}
