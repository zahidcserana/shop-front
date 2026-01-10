import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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

// AoT requires an exported factory function
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LoginModule,
    AlertModule.forRoot({ main: 'something' }),
    HttpWithInjectorModule.forRoot({ endPoint: '' }),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    KeyboardShortcutsModule.forRoot(),
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [ScriptLoaderService, AuthService, AuthGuard, HomeService, HomeResolveService],
  bootstrap: [AppComponent]
})
export class AppModule { }
