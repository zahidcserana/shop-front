import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AlertComponent} from './alert.component';
import {AlertConfig, AlertService} from './alert.service';


@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [AlertComponent],
    declarations: [AlertComponent],
    providers: [AlertService]
})
export class AlertModule {

    constructor(@Optional() @SkipSelf() parentModule: AlertModule) {
        if (parentModule) {
            throw new Error(
                'AlertModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config: AlertConfig): ModuleWithProviders {
        return {
            ngModule: AlertModule,
            providers: [
                {provide: AlertConfig, useValue: config}
            ]
        };
    }
}
