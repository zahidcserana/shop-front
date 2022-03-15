import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSettingsComponent } from './product-settings.component';

const routes: Routes = [
  {
    path: '',
    component: ProductSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductSettingsRoutingModule { }
