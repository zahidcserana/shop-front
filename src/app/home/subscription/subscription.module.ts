import { SharedPipeModule } from './../pipes/shared-pipe.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './subscription.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: SubscriptionComponent
  }
];
@NgModule({
  declarations: [SubscriptionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedPipeModule
  ],
  exports: [RouterModule]
})
export class SubscriptionModule { }
