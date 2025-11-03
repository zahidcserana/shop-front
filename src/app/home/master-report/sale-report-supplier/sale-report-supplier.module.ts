import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { MasterReportService } from '../master-report.service';
import { SharedPipeModule } from '../../pipes/shared-pipe.module';

import { SaleReportSupplierRoutingModule } from './sale-report-supplier-routing.module';
import { SaleReportSupplierComponent } from './sale-report-supplier.component';

@NgModule({
  declarations: [SaleReportSupplierComponent],
  imports: [
    CommonModule,
    SaleReportSupplierRoutingModule,
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    SharedPipeModule
  ],
  providers: [MasterReportService, DatePipe]
})

export class SaleReportSupplierModule { }
