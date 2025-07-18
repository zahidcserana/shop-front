import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleReportsComponent } from './sale-reports.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SaleReportsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleReportRoutingModule { }
