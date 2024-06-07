import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Stage {
  imageUrl: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-opening',
  templateUrl: './opening.component.html',
  styleUrls: ['./opening.component.scss']
})
export class OpeningComponent implements OnInit {
  private readonly STAGES: Stage[] = [
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

  currentStage: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('hasVisited')) {
      this.navigateToLogin();
    }
  }

  nextStage(): void {
    if (this.currentStage < this.STAGES.length - 1) {
      this.currentStage++;
    }
    if (this.currentStage === this.STAGES.length - 1) {
      localStorage.setItem('hasVisited', 'true');
    }
  }

  previousStage(): void {
    if (this.currentStage > 0) {
      this.currentStage--;
    }
  }

  skipToLogin(): void {
    localStorage.setItem('hasVisited', 'true');
    this.navigateToLogin();
  }

  get stages(): Stage[] {
    return this.STAGES;
  }

  private navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
