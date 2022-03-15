import { ReportComponent } from './report.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component'
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      {
        path: 'sale',
        loadChildren: './sale-report/sale-report.module#SaleReportModule'
      },
      {
        path: 'purchase',
        loadChildren: './purchase-report/purchase-report.module#PurchaseReportModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
