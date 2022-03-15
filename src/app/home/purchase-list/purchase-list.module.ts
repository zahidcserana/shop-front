import { PaginationModule } from './../../common/modules/pagination/pagination.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PurchaseListRoutingModule } from './purchase-list-routing.module';
import { PurchaseListComponent } from './purchase-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { PurchaseListService } from './services/purchase-list.service';
import { PurchaseListFilterComponent } from './purchase-list-filter/purchase-list-filter.component'
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SharedPipeModule } from '../pipes/shared-pipe.module';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [PurchaseListComponent, PurchaseListFilterComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ModalModule,
    NgbModule,
    PaginationModule,
    PurchaseListRoutingModule,
    BsDatepickerModule.forRoot(),
    SharedPipeModule,
    ToastrModule.forRoot()
  ],
  providers: [PurchaseListService, DatePipe]
})
export class PurchaseListModule { }
