import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from './services/purchase.service'

import { ToastrModule } from 'ngx-toastr';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';


@NgModule({
  declarations: [PurchaseComponent],
  imports: [
    CommonModule,
    FormsModule,
    PurchaseRoutingModule,
    NgbModule,
    ToastrModule.forRoot(),
    KeyboardShortcutsModule.forRoot(),
  ],
  providers: [PurchaseService],
})
export class PurchaseModule { }
