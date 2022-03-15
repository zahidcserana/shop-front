import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from './common/script-loader.service';
import { LoginModule } from './auth/login/login.module';
import { AuthService } from './auth/auth.service';
import { AlertModule } from './common/modules/alert/alert.module';
import { HttpWithInjectorModule } from './common/modules/http-with-injector/http-with-injector.module';
import { HomeService } from './home/services/home.service';
import { HomeResolveService } from './home/services/home-resolve.service';
import { AuthGuard } from './auth/auth-guard.service';
import { PageNotFoundComponent } from './common/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
 
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    AlertModule.forRoot({main: 'something'}),
    HttpWithInjectorModule.forRoot({endPoint: ''}),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    KeyboardShortcutsModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  providers: [ScriptLoaderService, AuthService, AuthGuard, HomeService, HomeResolveService],
  bootstrap: [AppComponent]
})
export class AppModule { }
