import { SaleService } from './../services/sale.service';
import { HomeService } from './../services/home.service';
import { SettingService } from './../services/setting.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ],
  providers: [ SettingService, HomeService, SaleService ]
})
export class SettingsModule { }
