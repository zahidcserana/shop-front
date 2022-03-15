import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class InventoryService {
  constructor(private http: HttpService) {}
  searchMedicine(search) {
    return this.http.get("medicines/searchFromInventory", { params: search });
  }

  getInventoryList(){
    return this.http.get(`inventory/list`).pipe(map(res => res));
  }
  getInventoryListWithPagination(p, l, query?) {
    const params = query ? query : '';
    //const limit  = l ? l : 100;
    return this.http
      .get(`inventory/list?page_no=${p ? p : 1}&limit=${l ? l : 20}`)
      .pipe(map(res => res));
  }
  getGenericList(data: any) {
    return this.http.post('inventory/generic/search', data).toPromise();
  }
  getCompanyList(){
    return this.http.get(`company-list`).pipe(map(res => res));
  }

  submitItem(data: any) {
    return this.http.post('purchase/save', data).toPromise();
  }

  getInventoryFilterList(params){
    return this.http.get(`inventory/listFilter?filter=${params}`).pipe(map(response => response));
  }

  updateLowStockQty(data: any) {
    return this.http.post('lowStockQty/update', data).toPromise();
  }

  updateMRPTP(data: any) {
    return this.http.post('MrpTp/update', data).toPromise();
  }

  searchProductType(search) {
    return this.http.get("type/search", { params: search });
  }
}
