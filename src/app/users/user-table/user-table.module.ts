import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserTableRoutingModule } from './user-table-routing.module';
import { UserTableComponent } from './user-table.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { DeleteDialogComponent } from './delete-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    UserTableComponent,
    DeleteDialogComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    UserTableRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class UserTableModule { }
