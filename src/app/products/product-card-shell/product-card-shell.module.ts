import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardShellComponent } from './product-card-shell.component';
import { ProductCardModule } from '../product-card/product-card.module';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductCardShellRoutingModule } from './product-card-shell-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { SideMenuModule } from '../side-menu/side-menu.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
    MatInputModule,
    MatSliderModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatIconModule,
    FontAwesomeModule,
  ],
  exports: [
    FontAwesomeModule
  ]
})
export class ProductCardShellModule { }
