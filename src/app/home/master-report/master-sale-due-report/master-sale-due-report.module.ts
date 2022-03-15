import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MasterSaleDueReportRoutingModule } from './master-sale-due-report-routing.module';
import { MasterSaleDueReportComponent } from './master-sale-due-report.component';
import { MasterReportService } from '../master-report.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [MasterSaleDueReportComponent],
  imports: [
    CommonModule,
    MasterSaleDueReportRoutingModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [MasterReportService, DatePipe]
})
export class MasterSaleDueReportModule { }
