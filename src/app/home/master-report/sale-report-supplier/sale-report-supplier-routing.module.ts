import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleReportSupplierComponent } from './sale-report-supplier.component';

const routes: Routes = [
  {
    path: '',
    component: SaleReportSupplierComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleReportSupplierRoutingModule { }
