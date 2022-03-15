import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterSaleDueReportComponent } from './master-sale-due-report.component'

const routes: Routes = [
  {
    path: '',
    component: MasterSaleDueReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSaleDueReportRoutingModule { }
