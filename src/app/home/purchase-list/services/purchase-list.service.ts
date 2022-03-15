import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class PurchaseListService {
  constructor(private http: HttpService) {}
  searchMedicine(search) {
    return this.http.get("medicines/search", { params: search });
  }

  getCompanyList(){
    return this.http.get(`company-list`).pipe(map(res => res));
  }
  getPurcheseList(p, l, query?) {
    const params = query ? query : '';
    return this.http
      .get(`purchase/list?page_no=${p ? p : 1}&limit=${l ? l : 20}${params}`)
      .pipe(map(res => res));
  }
  getPurcheseDetails(orderId: any){
    return this.http.get(`purchase/details/${orderId}`).pipe(map(res => res));
  }

  deletePurchaseDetails(data: any) {
    return this.http.post('purchase/details/delete', data).toPromise();
  }

  submitItemDetails(data: any) {
    return this.http.post('purchase/item/details/update', data).toPromise();
  }

  deleteItemDetails(data: any) {
    return this.http.post('purchase/item/delete', data).toPromise();
  }
}
