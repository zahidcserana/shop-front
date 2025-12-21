import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DamageListRoutingModule } from './damage-list-routing.module';
import { DamageListComponent } from './damage-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'src/app/common/_modal/modal.module';
import { DamageListService } from './services/damage-list.service';
import { DamageListFilterComponent } from './damage-list-filter/damage-list-filter.component'
import { BsDatepickerModule } from 'ngx-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { SharedPipeModule } from '../../pipes/shared-pipe.module';
import { PaginationModule } from 'src/app/common/modules/pagination/pagination.module';


@NgModule({
  declarations: [DamageListComponent, DamageListFilterComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ModalModule,
    NgbModule,
    PaginationModule,
    DamageListRoutingModule,
    BsDatepickerModule.forRoot(),
    SharedPipeModule,
    ToastrModule.forRoot(),
    TranslateModule
  ],
  providers: [DamageListService, DatePipe]
})
export class DamageListModule { }
