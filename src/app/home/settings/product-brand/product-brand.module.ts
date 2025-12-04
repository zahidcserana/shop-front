import { ProductService } from 'src/app/home/product/services/product.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductBrandComponent } from './product-brand.component';
import { Routes, RouterModule } from '@angular/router';
import { PaginationModule } from 'src/app/common/modules/pagination/pagination.module';
import { ProductBrandFilterComponent } from './product-brand-filter/product-brand-filter.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ProductBrandComponent
  }
];

@NgModule({
  declarations: [ProductBrandComponent, ProductBrandFilterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginationModule,
    FormsModule,
    NgbModule,
    ModalModule,
    TranslateModule
  ],
  providers: [ProductService],
  exports: [RouterModule]

})
export class ProductBrandModule { }
