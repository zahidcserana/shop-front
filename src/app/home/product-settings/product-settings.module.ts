import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductSettingsRoutingModule } from './product-settings-routing.module';
import { ProductSettingsComponent } from './product-settings.component';

import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductSettingsService } from './services/product-settings.service'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProductSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ProductSettingsRoutingModule,
    NgbModule,
    TranslateModule
  ],
  providers: [ProductSettingsService]
})
export class ProductSettingsModule { }
