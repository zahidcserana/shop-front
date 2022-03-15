import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { ModalModule } from 'src/app/common/_modal/modal.module';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ModalModule
  ],
  providers: [UserService]
})
export class UserModule { }
