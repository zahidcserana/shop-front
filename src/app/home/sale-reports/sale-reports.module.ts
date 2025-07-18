import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SaleReportRoutingModule } from './sale-report-routing.module';
import { SaleReportsComponent } from './sale-reports.component';
import { SaleService } from '../services/sale.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { SharedPipeModule } from '../pipes/shared-pipe.module';

@NgModule({
  declarations: [SaleReportsComponent],
  imports: [
    CommonModule,
    SaleReportRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    SharedPipeModule
  ],
  providers: [SaleService, DatePipe]
})
export class SaleReportsModule { }
