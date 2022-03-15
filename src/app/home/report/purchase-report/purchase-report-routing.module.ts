import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseReportComponent } from './purchase-report.component'

const routes: Routes = [
  {
    path: '',
    component: PurchaseReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseReportRoutingModule { }
