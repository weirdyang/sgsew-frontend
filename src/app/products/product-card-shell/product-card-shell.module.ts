import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardShellComponent } from './product-card-shell.component';
import { ProductCardModule } from '../product-card/product-card.module';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductCardShellRoutingModule } from './product-card-shell-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatSliderModule } from '@angular/material/slider';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { SideMenuModule } from '../side-menu/side-menu.module';

@NgModule({
  declarations: [
    ProductCardShellComponent
  ],
  imports: [
    CommonModule,
    SideMenuModule,
    ProductCardModule,
    ProductCardShellRoutingModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSliderModule
  ],
  exports: [
  ]
})
export class ProductCardShellModule { }
