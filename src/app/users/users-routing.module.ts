import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../services/guards/admin.guard';

const routes: Routes = [
  {
    path: 'list',
    loadChildren: () => import('./user-table/user-table.module').then(m => m.UserTableModule),
    canLoad: [AdminGuard]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
