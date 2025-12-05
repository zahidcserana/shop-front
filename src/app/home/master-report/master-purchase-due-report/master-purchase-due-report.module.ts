import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MasterPurchaseDueReportRoutingModule } from './master-purchase-due-report-routing.module';
import { MasterPurchaseDueReportComponent } from './master-purchase-due-report.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { MasterReportService } from '../master-report.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MasterPurchaseDueReportComponent],
  imports: [
    CommonModule,
    MasterPurchaseDueReportRoutingModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    TranslateModule
  ],
  providers: [MasterReportService, DatePipe]
})
export class MasterPurchaseDueReportModule { }
