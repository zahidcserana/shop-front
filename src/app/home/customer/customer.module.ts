import { CustomerService } from './../services/customer.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CustomerComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ModalModule,
    TranslateModule
  ],
  providers: [CustomerService]
})
export class CustomerModule { }
