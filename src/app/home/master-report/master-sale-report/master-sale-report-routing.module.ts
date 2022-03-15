import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterSaleReportComponent } from './master-sale-report.component'

const routes: Routes = [
  {
    path: '',
    component: MasterSaleReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSaleReportRoutingModule { }
