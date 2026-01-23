import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeResolveService } from './services/home-resolve.service';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        resolve: { dashboard: HomeResolveService }
      },
      {
        path: 'inventory',
        loadChildren: './inventory/inventory.module#InventoryModule',
      },
      {
        path: 'stock-balances',
        loadChildren: './stock-balance/stock-balance.module#StockBalanceModule',
      },
      {
        path: 'sale',
        loadChildren: './sale/sale.module#SaleModule',
        resolve: { companies: HomeResolveService }
      },
      {
        path: 'purchase',
        loadChildren: './purchase/purchase.module#PurchaseModule',
      },
      {
        path: 'purchase-due',
        loadChildren: './purchase-due/purchase-due.module#PurchaseDueModule',
      },
      {
        path: 'purchase-list',
        loadChildren: './purchase-list/purchase-list.module#PurchaseListModule',
      },
      {
        path: 'damage',
        loadChildren: './damage/damage.module#DamageModule',
      },
      {
        path: 'products',
        loadChildren: './product/product.module#ProductModule',
        resolve: { companies: HomeResolveService }
      },
      {
        path: 'sale-due',
        loadChildren: './sale-due/sale-due.module#SaleDueModule'
      },
      {
        path: 'sale-reports',
        loadChildren: './sale-reports/sale-reports.module#SaleReportsModule'
      },
      {
        path: 'sale-emi',
        loadChildren: './sale-emi/sale-emi.module#SaleEmiModule'
      },
      {
        path: 'report',
        loadChildren: './report/report.module#ReportModule',
        resolve: { companies: HomeResolveService }
      },
      {
        path: 'master-report',
        loadChildren: './master-report/master-report.module#MasterReportModule',
        resolve: { companies: HomeResolveService }
      },
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule',
        resolve: { users: HomeResolveService }
      },
      {
        path: 'supplier',
        loadChildren: './supplier/supplier.module#SupplierModule',
        resolve: { suppliers: HomeResolveService }
      },
      {
        path: 'notifications',
        loadChildren: './notification/notification.module#NotificationModule'
      },
      {
        path: 'cheat-sheet',
        loadChildren: './cheat-sheet/cheat-sheet.module#CheatSheetModule'
      },
      {
        path: 'subscription',
        loadChildren: './subscription/subscription.module#SubscriptionModule',
        resolve: { subscription: HomeResolveService }
      },
      {
        path: 'products/settings',
        loadChildren: './product-settings/product-settings.module#ProductSettingsModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
