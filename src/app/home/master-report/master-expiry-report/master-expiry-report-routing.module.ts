import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterExpiryReportComponent } from './master-expiry-report.component'

const routes: Routes = [
  {
    path: '',
    component: MasterExpiryReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterExpiryReportRoutingModule { }
