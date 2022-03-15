import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpConfig, HttpService} from './http.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpInspectorService} from './http-inspector.service';


@NgModule({
    imports: [
        HttpClientModule,
        CommonModule
    ],
    declarations: [],
    providers: [
        HttpService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInspectorService,
            multi: true
        }
    ]
})
export class HttpWithInjectorModule {
    constructor(@Optional() @SkipSelf() parentModule: HttpWithInjectorModule) {
        if (parentModule) {
            throw new Error(
                'AlertModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: HttpConfig): ModuleWithProviders {
        return {
            ngModule: HttpWithInjectorModule,
            providers: [
                {provide: HttpConfig, useValue: config}
            ]
        };
    }
}
