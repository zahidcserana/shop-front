import { ElementRef, Injectable, Optional, Renderer2, RendererFactory2 } from '@angular/core';
import { AlertComponent } from './alert.component';

const errorSvg = '<?xml version="1.0" encoding="iso-8859-1"?>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" ' +
    'x="0px" y="0px" viewBox="0 0 483.537 483.537" style="enable-background:new 0 0 483.537 483.537;" ' +
    'xml:space="preserve" width="30px" height="30px">\n' +
    '<g>\n' +
    '\t<g>\n' +
    '\t\t<g>\n' +
    '\t\t\t<path d="M479.963,425.047L269.051,29.854c-5.259-9.88-15.565-16.081-26.782-16.081h-0.03    ' +
    ' c-11.217,0-21.492,6.171-26.782,16.051L3.603,425.016c-5.046,9.485-4.773,' +
    '20.854,0.699,29.974     c5.502,9.15,15.413,14.774,26.083,14.774H453.12c10.701,0,20.58-5.594,26.083-14.774   ' +
    '  C484.705,445.84,484.979,434.471,479.963,425.047z M242.239,408.965c-16.781,0-30.399-13.619-30.399-30.399   ' +
    '  c0-16.78,13.619-30.399,30.399-30.399c16.75,0,30.399,13.619,30.399,30.399C272.638,395.346,259.02,408.965,242' +
    '.239,408.965z      M272.669,287.854c0,16.811-13.649,30.399-30.399,30.399c-16.781,0-30.399-13.589-30.399-30' +
    '.399V166.256     c0-16.781,13.619-30.399,30.399-30.399c16.75,0,30.399,13.619,30.399,30.399V287.854z" fill="#FFFFFF"/>\n' +
    '\t\t</g>\n' +
    '\t</g>\n' +
    '\t\n' +
    '</g>\n' +
    '\n' +
    '</svg>';
const successSvg = '<?xml version="1.0" encoding="iso-8859-1"?>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1"' +
    ' x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" ' +
    'xml:space="preserve" width="30px" height="30px">\n' +
    '<g>\n' +
    '\t<g>\n' +
    '\t\t<path d="M256,0C114.615,0,0,114.616,0,256s114.615,256,256,256s256-114.616,256-256S397.385,0,256,0z' +
    ' M212.746,400.76    l-101.743-92.502l50.566-55.618l43.996,39.999l137.956-163.692l57.478,48.441L212.746,400.76z" fill="#FFFFFF"/>\n' +
    '\t</g>\n' +
    '</g>\n' +
    '</svg>';
const infoSvg = '<?xml version="1.0" encoding="iso-8859-1"?>\n' +
    '\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" ' +
    'x="0px" y="0px" width="30px" height="30px" viewBox="0 0 442.761 442.762" style="enable-background:new 0 0 ' +
    '442.761 442.762;" xml:space="preserve">\n' +
    'xml:space="preserve" width="30px" height="30px">\n' +
    '<g>\n' +
    '\t<path d="M237.081,31.617c-113.594,0-205.679,84.96-205.679,189.764c0,28.473,6.809,55.473,18.986,79.711L1.735,' +
    '389.064   c-2.704,4.887-2.215,10.916,1.239,15.307c2.672,3.396,6.722,5.299,10.911,5.299c1.223,0,2.457-0.162,3' +
    '.674-0.496l106.505-29.234   c32.434,19.719,71.269,31.205,113.016,31.205c113.595,0,205.681-84.959,205.681-189' +
    '.764   C442.761,116.577,350.674,31.617,237.081,31.617z M236.801,126.781c11.227,0,20.357,9.132,20.357,20.357 ' +
    '  c0,11.226-9.132,20.358-20.357,20.358c-11.225,0-20.357-9.132-20.357-20.358C216.443,135.914,225.576,126.781,' +
    '236.801,126.781z    M257.573,297.481c0,10.2-8.299,18.5-18.5,18.5s-18.5-8.3-18.5-18.5v-87.467h-19.385c-8.836,' +
    '0-16-7.164-16-16s7.164-16,16-16   h37.229c0.219-0.008,0.434-0.033,0.655-0.033c10.201,0,18.5,8.299,18.5,18' +
    '.5L257.573,297.481L257.573,297.481z" fill="#FFFFFF"/>\n' +
    '</g>\n' +
    '</svg>\n';

export class AlertConfig {
    main: string;
}

@Injectable()
export class AlertService {
    masterAlertId: string;
    errrorComponent: Element;
    private renderer: Renderer2;
    component: AlertComponent;

    constructor(@Optional() config: AlertConfig, rendererFactory: RendererFactory2) {
        if (config) {
            this.masterAlertId = config.main;
        }
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    error(element: ElementRef, message: string, deletable?: boolean, lifetime?: number) {
        const el = this.getElement(message, 'error');
        if (deletable) {
            this.setRemovable(element.nativeElement, el);
        }
        this.renderer.appendChild(element.nativeElement, el);

        if (lifetime > 0) {
            this.setLifetime(element.nativeElement, el, lifetime);
        }
    }

    setLifetime(parent, el, lifetime) {
        setTimeout(_ => {
            this.renderer.removeChild(parent, el);
        }, lifetime);
    }

    private getElement(message: any, type: string) {
        const el = this.renderer.createElement('div');
        this.renderer.addClass(el, 'alert');
        this.renderer.addClass(el, 'row');
        this.renderer.setStyle(el, 'margin', '0px');
        // this.renderer.setStyle(el, 'padding', '5px 0px');
        const icon = this.renderer.createElement('div');
        this.renderer.addClass(icon, 'pre-icon');
        this.renderer.setStyle(icon, 'margin', 'auto 0px');
        this.renderer.addClass(icon, 'col-2');
        this.renderer.appendChild(el, icon);
        const text = this.renderer.createText(message);
        const messageBlock = this.renderer.createElement('div');
        this.renderer.addClass(messageBlock, 'content');
        this.renderer.addClass(messageBlock, 'col-9');
        // this.renderer.setStyle(messageBlock, 'display', 'flex');
        this.renderer.setStyle(messageBlock, 'align-items', 'center');
        this.renderer.appendChild(messageBlock, text);
        this.renderer.appendChild(el, messageBlock);
        switch (type) {
            case 'success':
                this.renderer.addClass(el, 'alert-success');
                icon.innerHTML = successSvg;
                break;
            case 'error':
                this.renderer.addClass(el, 'alert-danger');
                icon.innerHTML = errorSvg;
                break;
            default:
                this.renderer.addClass(el, 'alert-info');
                icon.innerHTML = infoSvg;
                break;
        }
        return el;
    }

    private setRemovable(parent, el) {
        const anc = this.renderer.createElement('span');
        this.renderer.addClass(anc, 'close');
        this.renderer.setStyle(anc, 'margin', 'auto');
        this.renderer.setStyle(anc, 'padding', '0px');
        anc.addEventListener('click', e => {
            this.renderer.removeChild(parent, el);
        });
        this.renderer.appendChild(el, anc);
    }

    success(element: ElementRef, message: string, deletable?: boolean, lifetime?: number) {
        const el = this.getElement(message, 'success');
        if (deletable) {
            this.setRemovable(element.nativeElement, el);
        }
        this.renderer.appendChild(element.nativeElement, el);

        if (lifetime > 0) {
            this.setLifetime(element.nativeElement, el, lifetime);
        }
    }

    info(element: ElementRef, message: string, deletable?: boolean, lifetime?: number) {
        const el = this.getElement(message, 'info');
        if (deletable) {
            this.setRemovable(element.nativeElement, el);
        }
        this.renderer.appendChild(element.nativeElement, el);

        if (lifetime > 0) {
            this.setLifetime(element.nativeElement, el, lifetime);
        }
    }
}
