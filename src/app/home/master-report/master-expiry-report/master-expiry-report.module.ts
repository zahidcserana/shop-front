import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterExpiryReportRoutingModule } from './master-expiry-report-routing.module';
import { MasterExpiryReportComponent } from './master-expiry-report.component';

@NgModule({
  declarations: [MasterExpiryReportComponent],
  imports: [
    CommonModule,
    MasterExpiryReportRoutingModule
  ]
})
export class MasterExpiryReportModule { }
