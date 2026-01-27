import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";

import { Observable } from 'rxjs';
import { EmiInstallmentData } from './emi.model';

@Injectable({ providedIn: 'root' })
export class EmiService {
    constructor(private http: HttpService) { }

    getEmiInstallments(filters: any): Observable<EmiInstallmentData> {
        let params = new HttpParams();

        Object.keys(filters).forEach(key => {
        if (filters[key]) {
            params = params.set(key, filters[key]);
        }
        });

        return this.http.get("emi-installments", { params });
    }

    searchCustomer(term: string): Observable<any[]> {
        const params = new HttpParams().set('q', term);
        return this.http.get("customers/search", { params });
    }

    payInstallment(id: number, payload: any) {
        return this.http.post(`emi-installments/${id}/pay`, payload);
    }

}
