import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DamageRoutingModule } from './damage-routing.module';
import { DamageComponent } from './damage.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DamageService } from './services/damage.service'

import { ToastrModule } from 'ngx-toastr';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { SharedPipeModule } from '../pipes/shared-pipe.module';
import { TranslateModule } from '@ngx-translate/core';
import { DamageListModule } from './damage-list/damage-list.module';


@NgModule({
  declarations: [DamageComponent],
  imports: [
    CommonModule,
    FormsModule,
    DamageRoutingModule,
    NgbModule,
    ToastrModule.forRoot(),
    KeyboardShortcutsModule.forRoot(),
    SharedPipeModule,
    TranslateModule,
    DamageListModule
  ],
  providers: [DamageService],
})
export class DamageModule { }
