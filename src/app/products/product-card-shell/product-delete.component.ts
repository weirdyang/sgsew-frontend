import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProductDisplay } from 'src/app/types/product';
import { nameComparisonValidator } from 'src/app/users/user-table/username.validator';

@Component({
  selector: 'app-product-delete',
  templateUrl: './product-delete.component.html',
  styleUrls: ['./product-delete.component.scss']
})
export class ProductDeleteComponent {

  productName: string = '';
  product!: FormControl;

  constructor(
    private dialogRef: MatDialogRef<ProductDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) data: string) {
    this.productName = data;
    this.product = new FormControl('', [Validators.required, nameComparisonValidator(data)]);
  }

  submit() {
    this.dialogRef.close(true)
  }
  dismiss() {
    this.dialogRef.close();
  }
}
