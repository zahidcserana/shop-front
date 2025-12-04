import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SaleDueRoutingModule } from './sale-due-routing.module';
import { SaleDueComponent } from './sale-due.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../services/sale.service';
import { DueFilterComponent } from './due-filter/due-filter.component';
import { PaginationModule } from 'src/app/common/modules/pagination/pagination.module';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [SaleDueComponent, DueFilterComponent],
  imports: [
    CommonModule,
    SaleDueRoutingModule,
    PaginationModule,
    ModalModule,
    NgbModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    TranslateModule
  ],
  providers: [SaleService, DatePipe]
})
export class SaleDueModule { }
