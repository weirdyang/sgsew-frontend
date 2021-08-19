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
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    UserTableComponent,
    DeleteDialogComponent],
  imports: [
    SharedModule,
    CommonModule,
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
