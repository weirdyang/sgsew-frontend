import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes =
  [
    {
      path: 'about',
      loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
    },
    {
      path: 'contact',
      loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
    },
    {
      path: '',
      loadChildren: () => import('./main/main.module').then(m => m.MainModule)
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
