import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseReportRoutingModule } from './purchase-report-routing.module';
import { PurchaseReportComponent } from './purchase-report.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { PurchaseReportService } from './services/purchase-report.service';
import { BsDatepickerModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [PurchaseReportComponent],
  imports: [
    CommonModule,
    PurchaseReportRoutingModule,
    FormsModule,
    NgbModule,
    ModalModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [PurchaseReportService]
})
export class PurchaseReportModule { }
