import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
@Input() public title='';
@Input() public needAprove!:boolean;
@Input() public aprovelText='';
@Input() public img='';
@Input() public text='';

public isHidden=true

step=1;



onclick(boolean:boolean){
if(boolean){
  this.step++
  //open modal 
  //this.step=1
}else{
  //close modale
  //this.step=1
}
}



}
