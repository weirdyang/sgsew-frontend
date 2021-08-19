import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardShellComponent } from './product-card-shell.component';
import { ProductCardModule } from '../product-card/product-card.module';
import { ProductCardShellRoutingModule } from './product-card-shell-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SideMenuModule } from '../side-menu/side-menu.module';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogModule } from 'src/app/shared/delete-dialog/delete-dialog.module';
@NgModule({
  declarations: [
    ProductCardShellComponent,
  ],
  imports: [
    CommonModule,
    SideMenuModule,
    ProductCardModule,
    ProductCardShellRoutingModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatIconModule,
    FontAwesomeModule,
    MatDialogModule,
    DeleteDialogModule
  ],
  exports: [
    FontAwesomeModule
  ]
})
export class ProductCardShellModule { }
