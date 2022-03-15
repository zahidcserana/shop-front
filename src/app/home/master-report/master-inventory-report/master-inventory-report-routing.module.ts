import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterInventoryReportComponent } from './master-inventory-report.component'

const routes: Routes = [
  {
    path: '',
    component: MasterInventoryReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterInventoryReportRoutingModule { }
