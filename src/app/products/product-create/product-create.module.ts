import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductCreateComponent } from './product-create.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductCreateRoutingModule } from './product-create-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DecimalDirectiveModule } from 'src/app/shared/decimal-directive/decimal-directive.module';

@NgModule({
  declarations: [
    ProductCreateComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule,
    ProductCreateRoutingModule,
    MatTooltipModule,
    DecimalDirectiveModule
  ],
  providers: [
    CurrencyPipe
  ],
  exports: [
    ProductCreateComponent,
  ]
})
export class ProductCreateModule { }
