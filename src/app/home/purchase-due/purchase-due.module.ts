import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseDueRoutingModule } from './purchase-due-routing.module';
import { PurchaseDueComponent } from './purchase-due.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PurchaseDueService } from './services/purchase-due.service'

@NgModule({
  declarations: [PurchaseDueComponent],
  imports: [
    CommonModule,
    PurchaseDueRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [PurchaseDueService]
})
export class PurchaseDueModule { }
