import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delet-dialog',
  templateUrl: './delet-dialog.component.html',
  styleUrls: ['./delet-dialog.component.scss']
})
export class DeletDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<DeletDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close('no'); // Emit 'no' when the "No" button is clicked
  }

  onYesClick(): void {
    this.dialogRef.close('yes'); // Emit 'yes' when the "Yes" button is clicked
  }

}



