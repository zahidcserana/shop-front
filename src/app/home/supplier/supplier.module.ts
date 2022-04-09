import { SupplierService } from './../services/supplier.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierComponent } from './supplier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'src/app/common/_modal/modal.module';

@NgModule({
  declarations: [SupplierComponent],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ModalModule
  ],
  providers: [SupplierService]
})
export class SupplierModule { }
