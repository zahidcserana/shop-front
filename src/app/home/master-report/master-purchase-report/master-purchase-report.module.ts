import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MasterPurchaseReportRoutingModule } from './master-purchase-report-routing.module';
import { MasterPurchaseReportComponent } from './master-purchase-report.component';
import { MasterReportService } from '../master-report.service'
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MasterPurchaseReportComponent],
  imports: [
    CommonModule,
    MasterPurchaseReportRoutingModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    TranslateModule
  ],
  providers: [MasterReportService, DatePipe]
})
export class MasterPurchaseReportModule { }
