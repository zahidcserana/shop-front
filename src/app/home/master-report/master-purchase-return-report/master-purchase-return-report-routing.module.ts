import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterPurchaseReturnReportComponent } from './master-purchase-return-report.component';

const routes: Routes = [
  {
    path: '',
    component: MasterPurchaseReturnReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterPurchaseReturnReportRoutingModule { }
