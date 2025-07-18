import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SaleReportRoutingModule } from './sale-report-routing.module';
import { SaleReportsComponent } from './sale-reports.component';
import { SaleService } from '../services/sale.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SaleReportsComponent],
  imports: [
    CommonModule,
    SaleReportRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
  ],
  providers: [SaleService, DatePipe]
})
export class SaleReportsModule { }
