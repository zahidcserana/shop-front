import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterPurchaseReturnReportRoutingModule } from './master-purchase-return-report-routing.module';
import { MasterPurchaseReturnReportComponent } from './master-purchase-return-report.component';

@NgModule({
  declarations: [MasterPurchaseReturnReportComponent],
  imports: [
    CommonModule,
    MasterPurchaseReturnReportRoutingModule
  ]
})
export class MasterPurchaseReturnReportModule { }
