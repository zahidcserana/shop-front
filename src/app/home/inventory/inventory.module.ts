import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { InventoryService } from './services/inventory.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from './../../common/modules/pagination/pagination.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ModalModule } from 'src/app/common/_modal/modal.module';


@NgModule({
  declarations: [InventoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    InventoryRoutingModule,
    PaginationModule,
    NgxBarcodeModule,
    ModalModule,
    NgbModule
  ],
  providers: [InventoryService]
})
export class InventoryModule { }
