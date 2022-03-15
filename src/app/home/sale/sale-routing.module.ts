import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleComponent } from './sale.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SaleComponent
      },
      {
        path: 'list',
        loadChildren: './sale-list/sale-list.module#SaleListModule',
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRoutingModule { }
