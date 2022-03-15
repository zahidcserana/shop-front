
// local server

import {environment} from '../../../environments/environment';

export const storeHoshName = environment.storeHoshName;

export const EndPoint = environment.api_url + "api/";
export const user_image = environment.api_url + "img/upload/users/";
export const product_image = environment.api_url + "img/upload/products/";
export const PrescriptionImageUrl = environment.api_url + "assets/prescription_image/";

export const domainName = (store, check: string) => {
    store = environment.storeHoshName.includes('localhost:4200') || check === "company" ? '' : store;
    const host = check === "company" ? environment.patnerHoshName : environment.storeHoshName;
    return `${environment.protocal}${store}${host}`;
};

export const logOutStore = environment.storeHoshName.includes('localhost:4200') ? 'http://localhost:4200' : (environment.protocal + 'sms' + environment.storeHoshName);
