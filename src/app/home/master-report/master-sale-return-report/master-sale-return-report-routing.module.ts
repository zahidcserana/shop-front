import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterSaleReturnReportComponent } from './master-sale-return-report.component'

const routes: Routes = [
  {
    path: '',
    component: MasterSaleReturnReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSaleReturnReportRoutingModule { }
