import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUserDisplay } from 'src/app/types/user';
import { nameComparisonValidator } from './username.validator';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {


  username!: FormControl;
  user!: IUserDisplay
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: IUserDisplay) {
    console.log(data);
    this.user = data
    this.username = new FormControl('', [Validators.required, nameComparisonValidator(this.user.username)]);
  }

  submit() {
    this.dialogRef.close(true)
  }
  dismiss() {
    this.dialogRef.close();
  }

}
