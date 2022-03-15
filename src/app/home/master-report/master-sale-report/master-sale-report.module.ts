import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MasterSaleReportRoutingModule } from './master-sale-report-routing.module';
import { MasterSaleReportComponent } from './master-sale-report.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MasterReportService } from '../master-report.service';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SaleService } from '../../services/sale.service';

@NgModule({
  declarations: [MasterSaleReportComponent],
  imports: [
    CommonModule,
    MasterSaleReportRoutingModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [MasterReportService, DatePipe, SaleService]
})
export class MasterSaleReportModule { }
