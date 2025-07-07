import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class MasterReportService {
  constructor(private http: HttpService) { }
  searchMedicine(search) {
    return this.http.get("medicines/search", { params: search });
  }

  getInventoryList(params = '') {
    return this.http.get(`inventory/list?${params}`).pipe(map(response => response));
  }

  searchProductType(search) {
    return this.http.get("type/search", { params: search });
  }

  getInventoryFilterList(params) {
    return this.http.get(`master/inventory/listFilter?filter=${params}`).pipe(map(response => response));
  }

  getCompanyList() {
    return this.http.get(`companies`).pipe(map(res => res));
  }

  getSalesPersonsList() {
    return this.http.get(`sales/persons/list`).pipe(map(res => res));
  }

  searchSaleList(search?) {
    const params = search ? search : '';
    return this.http.get(`sale/report?${params}`);
  }

  searchSaleReturnList(search?) {
    const params = search ? search : '';
    return this.http.get(`sale/return/report?${params}`);
  }

  searchPurcheseList(data: any) {
    return this.http.post('master/purchase/list/filter', data).toPromise();
  }

  searchDueList(search?) {
    const params = search ? search : '';
    return this.http.get(`sale/due/report?${params}`);
  }

  getPurcheseList() {
    return this.http.get(`master/purchase/list`).pipe(map(res => res));
  }

  getPurcheseDueList() {
    return this.http.get(`master/purchase/due/list`).pipe(map(res => res));
  }
  getExpiryMedicine(p, l, query?) {
    const params = query ? query : '';
    return this.http
      .get(`medicines/expired-date?page_no=${p ? p : 1}&limit=${l ? l : 20}${params}`)
      .pipe(map(res => res));
  }
  searchPurcheseDueList(data: any) {
    return this.http.post('master/purchase/due/list/filter', data).toPromise();
  }
  expStatus(s) {
    if (s) {
        switch (s) {
            case 'EXP':
                return 'btn btn-danger btn-sm';
            case '3M':
                return 'btn btn-warning btn-sm';
        }
    }
    return 'btn btn-success btn-sm';
  }
}
