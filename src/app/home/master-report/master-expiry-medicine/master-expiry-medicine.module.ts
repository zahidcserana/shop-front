import { SharedPipeModule } from './../../pipes/shared-pipe.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MasterExpiryMedicineComponent } from './master-expiry-medicine.component';
import { RouterModule, Routes } from '@angular/router';
import { MasterReportService } from '../master-report.service';
import { PaginationModule } from 'src/app/common/modules/pagination/pagination.module';
import { ExpiryFilterComponent } from './expiry-filter/expiry-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';
const routes: Routes = [
  {
    path: '',
    component: MasterExpiryMedicineComponent
  }
];
@NgModule({
  declarations: [MasterExpiryMedicineComponent, ExpiryFilterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedPipeModule,
    PaginationModule,
    NgbModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  providers: [MasterReportService, DatePipe]
})
export class MasterExpiryMedicineModule { }
