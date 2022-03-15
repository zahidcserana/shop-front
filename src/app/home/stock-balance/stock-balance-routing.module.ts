import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockBalanceComponent } from './stock-balance.component';

const routes: Routes = [
  {
    path: '',
    component: StockBalanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockBalanceRoutingModule { }
