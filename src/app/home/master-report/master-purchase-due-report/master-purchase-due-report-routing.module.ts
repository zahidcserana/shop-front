import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterPurchaseDueReportComponent } from './master-purchase-due-report.component'

const routes: Routes = [
  {
    path: '',
    component: MasterPurchaseDueReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterPurchaseDueReportRoutingModule { }
