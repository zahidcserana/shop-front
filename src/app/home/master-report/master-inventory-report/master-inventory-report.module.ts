import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MasterInventoryReportRoutingModule } from './master-inventory-report-routing.module';
import { MasterInventoryReportComponent } from './master-inventory-report.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { MasterReportService } from '../master-report.service';
import { SharedPipeModule } from '../../pipes/shared-pipe.module';

@NgModule({
  declarations: [MasterInventoryReportComponent],
  imports: [
    CommonModule,
    MasterInventoryReportRoutingModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    SharedPipeModule
  ],
  providers: [MasterReportService, DatePipe]
})
export class MasterInventoryReportModule { }
