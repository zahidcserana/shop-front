import { ProductService } from './../product/services/product.service';
import { SaleService } from './../services/sale.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterReportRoutingModule } from './master-report-routing.module';
import { MasterReportComponent } from './master-report.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MasterReportService } from './master-report.service'

@NgModule({
  declarations: [MasterReportComponent],
  imports: [
    CommonModule,
    MasterReportRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [MasterReportService, SaleService, ProductService]
})
export class MasterReportModule { }
