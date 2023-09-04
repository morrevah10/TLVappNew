import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeletDialogComponent } from '../cmps/delet-dialog/delet-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmationDialog(apartmentId: number): MatDialogRef<DeletDialogComponent> {
    const dialogRef = this.dialog.open(DeletDialogComponent, {
      width: '300px',
      data: { apartmentId }, // Pass data to the dialog component
    });
  
    return dialogRef;
  }
}