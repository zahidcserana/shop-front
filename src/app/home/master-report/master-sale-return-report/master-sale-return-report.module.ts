import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MasterSaleReturnReportRoutingModule } from './master-sale-return-report-routing.module';
import { MasterSaleReturnReportComponent } from './master-sale-return-report.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SaleService } from '../../services/sale.service';
import { MasterReportService } from '../master-report.service';

@NgModule({
  declarations: [MasterSaleReturnReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    MasterSaleReturnReportRoutingModule
  ],
  providers: [MasterReportService, DatePipe, SaleService]
})
export class MasterSaleReturnReportModule { }
