import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() public title = '';
  @Input() public needAprove!: boolean;
  @Input() public aprovelText = '';
  @Input() public img = '';
  @Input() public text = '';
  @Input() public serverResponse!:boolean
  @Input() public isHid!: boolean;
  @Output() public isHidChange = new EventEmitter<boolean>();
  @Output() public isApproved = new EventEmitter<boolean>()

  step = 1;
  isApprovedOnModal=false

  public close(): void {
    if(this.isApprovedOnModal=true){

    }
    this.isHid = false;
    this.isHidChange.emit(this.isHid);
  }

  public open(): void {
    this.isHid = true;
    // this.isHidChange.emit(this.isHid);
  }

  onclick(boolean: boolean) {
    if (boolean) {
      this.step++;
      this.isApproved.emit(true)
      this.isApprovedOnModal=true
      console.log('this.serverResponse',this.serverResponse)
      //open modal
      //this.step=1
    } else {
      this.isHid = false;
      this.isHidChange.emit(this.isHid);
      // this.step--;
      //close modale
      //this.step=1
    }
  }
}
