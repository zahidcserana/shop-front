import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleEmiComponent } from './sale-emi.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SaleEmiComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleEmiRoutingModule { }
