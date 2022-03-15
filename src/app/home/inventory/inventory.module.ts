import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { InventoryService } from './services/inventory.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from './../../common/modules/pagination/pagination.module';


@NgModule({
  declarations: [InventoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    InventoryRoutingModule,
    PaginationModule,
    NgbModule
  ],
  providers: [InventoryService]
})
export class InventoryModule { }
