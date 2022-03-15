import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { StockBalanceRoutingModule } from './stock-balance-routing.module';
import { StockBalanceComponent } from './stock-balance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from './../../common/modules/pagination/pagination.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StockBalanceService } from './stock-balance.service';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { SharedPipeModule } from '../pipes/shared-pipe.module';
import { SaleListModule } from '../sale/sale-list/sale-list.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DataFilterComponent } from './data-filter/data-filter.component';

@NgModule({
  declarations: [StockBalanceComponent, DataFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    StockBalanceRoutingModule,
    NgbModule,
    ModalModule,
    SaleListModule,
    BsDatepickerModule.forRoot(),
    KeyboardShortcutsModule.forRoot(),
    SharedPipeModule,
    PaginationModule,
    NgbModule,
    ReactiveFormsModule,
    ModalModule,
  ],
  providers: [StockBalanceService, DatePipe]
})
export class StockBalanceModule { }
