import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterPurchaseReportComponent } from './master-purchase-report.component'

const routes: Routes = [
  {
    path: '',
    component: MasterPurchaseReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterPurchaseReportRoutingModule { }
