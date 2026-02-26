import { CustomerService } from './../services/customer.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { EmiService } from '../sale-emi/emi.service';
import { SharedPipeModule } from '../pipes/shared-pipe.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [CustomerComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    SharedPipeModule,
    NgSelectModule,
    ModalModule,
    TranslateModule
  ],
  providers: [CustomerService, EmiService]
})
export class CustomerModule { }
