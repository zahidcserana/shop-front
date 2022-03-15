import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HomeService } from '../services/home.service';
import stock from 'highcharts/modules/stock.src';
import more from 'highcharts/highcharts-more.src';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [stock, more];
}
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartModule
  ],
  providers: [HomeService, { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }]
})
export class DashboardModule { }
