import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCardShellComponent } from './product-card-shell.component';

const routes: Routes = [{ path: '', component: ProductCardShellComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductCardShellRoutingModule { }
