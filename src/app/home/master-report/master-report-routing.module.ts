import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterReportComponent } from './master-report.component'

const routes: Routes = [
  {
    path: '',
    component: MasterReportComponent,
    children: [
      {
        path: 'expiry-medicine',
        loadChildren: './master-expiry-medicine/master-expiry-medicine.module#MasterExpiryMedicineModule'
      },
      {
        path: 'expiry',
        loadChildren: './master-expiry-report/master-expiry-report.module#MasterExpiryReportModule'
      },
      {
        path: 'inventory',
        loadChildren: './master-inventory-report/master-inventory-report.module#MasterInventoryReportModule'
      },
      {
        path: 'sale-report-supplier',
        loadChildren: './sale-report-supplier/sale-report-supplier.module#SaleReportSupplierModule'
      },
      {
        path: 'purchase',
        loadChildren: './master-purchase-report/master-purchase-report.module#MasterPurchaseReportModule'
      },
      {
        path: 'purchase-due',
        loadChildren: './master-purchase-due-report/master-purchase-due-report.module#MasterPurchaseDueReportModule'
      },
      {
        path: 'purchase-return',
        loadChildren: './master-purchase-return-report/master-purchase-return-report.module#MasterPurchaseReturnReportModule'
      },
      {
        path: 'sale',
        loadChildren: './master-sale-report/master-sale-report.module#MasterSaleReportModule'
      },
      {
        path: 'sale-due',
        loadChildren: './master-sale-due-report/master-sale-due-report.module#MasterSaleDueReportModule'
      },
      {
        path: 'sale-return',
        loadChildren: './master-sale-return-report/master-sale-return-report.module#MasterSaleReturnReportModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterReportRoutingModule { }
