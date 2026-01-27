import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SaleEmiComponent } from './sale-emi.component';
import { SaleService } from '../services/sale.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { SharedPipeModule } from '../pipes/shared-pipe.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { SaleEmiRoutingModule } from './sale-emi-routing.module';

@NgModule({
  declarations: [SaleEmiComponent],
  imports: [
    CommonModule,
    SaleEmiRoutingModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    SharedPipeModule,
    NgSelectModule,
    TranslateModule
  ],
  providers: [SaleService, DatePipe]
})
export class SaleEmiModule { }
