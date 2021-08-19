import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../services/guards/auth.guard';

const routes: Routes = [
  { path: 'list', loadChildren: () => import('./product-card-shell/product-card-shell.module').then(m => m.ProductCardShellModule), },
  {
    path: 'create',
    loadChildren: () => import('./product-create/product-create.module').then(m => m.ProductCreateModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'update', loadChildren: () => import('./product-update/product-update.module').then(m => m.ProductUpdateModule),
    canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
