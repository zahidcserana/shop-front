import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SaleListComponent } from './sale-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SaleService } from '../../services/sale.service';
import { PaginationModule } from 'src/app/common/modules/pagination/pagination.module';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaleFilterComponent } from './sale-filter/sale-filter.component';
import { BsDatepickerModule} from 'ngx-bootstrap';
import { SharedPipeModule } from '../../pipes/shared-pipe.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: SaleListComponent,
  }
];
@NgModule({
  declarations: [SaleListComponent, SaleFilterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    PaginationModule,
    ModalModule,
    NgbModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    SharedPipeModule,
    TranslateModule
  ],
  providers: [SaleService, DatePipe]
})
export class SaleListModule { }
