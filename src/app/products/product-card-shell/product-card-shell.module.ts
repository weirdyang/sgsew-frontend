import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardShellComponent } from './product-card-shell.component';
import { ProductCardModule } from '../product-card/product-card.module';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductCardShellRoutingModule } from './product-card-shell-routing.module';




@NgModule({
  declarations: [
    ProductCardShellComponent
  ],
  imports: [
    CommonModule,
    ProductCardModule,
    ProductCardShellRoutingModule
  ],
  exports: [
  ]
})
export class ProductCardShellModule { }
