import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseDueComponent } from './purchase-due.component'

const routes: Routes = [
  {
    path: '',
    component: PurchaseDueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseDueRoutingModule { }
