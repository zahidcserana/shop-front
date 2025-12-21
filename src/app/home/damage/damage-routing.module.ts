import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DamageComponent } from './damage.component';
import { DamageListComponent } from './damage-list/damage-list.component';


const routes: Routes = [
  {
    path: '',
    component: DamageComponent
  },
  {
    path: 'list',
    component: DamageListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DamageRoutingModule { }
