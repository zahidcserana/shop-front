import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductService } from './services/product.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { FilterProductComponent } from './filter-product/filter-product.component';


@NgModule({
  declarations: [ProductComponent, FilterProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    NgbModule,
    ModalModule
  ],
  providers: [ProductService]
})
export class ProductModule { }
