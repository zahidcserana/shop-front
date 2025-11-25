import { SharedPipeModule } from './../pipes/shared-pipe.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleRoutingModule } from './sale-routing.module';
import { SaleComponent } from './sale.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SaleService } from '../services/sale.service';
import { FormsModule } from '@angular/forms';
import { SaleListModule } from './sale-list/sale-list.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { EnterFocusDirective } from 'src/app/common/enter-focus.directive';

@NgModule({
  declarations: [SaleComponent, EnterFocusDirective],
  imports: [
    CommonModule,
    FormsModule,
    SaleRoutingModule,
    NgbModule,
    ModalModule,
    SaleListModule,
    BsDatepickerModule.forRoot(),
    KeyboardShortcutsModule.forRoot(),
    SharedPipeModule
  ],
  providers:[]
})
export class SaleModule { }
