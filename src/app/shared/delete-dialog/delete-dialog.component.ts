import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { nameComparisonValidator } from 'src/app/users/user-table/username.validator';
import { DeleteData } from './delete-data';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {

  dataSource!: DeleteData;
  control!: FormControl;

  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: DeleteData) {
    this.dataSource = data;
    this.control = new FormControl('', [Validators.required, nameComparisonValidator(data.propertyValue)]);
  }

  submit() {
    this.dialogRef.close(true)
  }
  dismiss() {
    this.dialogRef.close();
  }
}

