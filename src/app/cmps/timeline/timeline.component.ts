import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit{
  @Input() messages: any[] = [];

  ngOnInit(){
    console.log('timeline',this.messages)
    
  }

  calculateTotalDuration(): string {
   
    const totalDuration = this.messages.length * 1; 
    return `${totalDuration}s`;
  }

  calculateAnimationDelay(index: number): string {
    return `${index}s`;
  }

  isLeftContainer(index: number): boolean {
    return index % 2 !== 0; // Check if the index is odd
  }

  isRightContainer(index: number): boolean {
    return index % 2 === 0; // Check if the index is even
  }
}
