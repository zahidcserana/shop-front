import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleReportComponent } from './sale-report.component';
import { PaginationModule, BsDatepickerModule } from 'ngx-bootstrap';
import { SaleReportFilterComponent } from './sale-report-filter/sale-report-filter.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: SaleReportComponent
  }
];
@NgModule({
  declarations: [SaleReportComponent, SaleReportFilterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginationModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    NgbModule
  ]
})
export class SaleReportModule { }
