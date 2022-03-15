import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class PurchaseReportService {
  constructor(private http: HttpService) {}
  searchMedicine(search) {
    return this.http.get("medicines/search", { params: search });
  }

  getCompanyList(){
    return this.http.get(`company-list`).pipe(map(res => res));
  }

  getPurcheseList(){
    return this.http.get(`purchase/list`).pipe(map(res => res));
  }

  filterItemDetails(data: any){
    return this.http.post('purchase/item/filter', data).toPromise();
  }

  getPurcheseDetails(orderId: any){
    return this.http.get(`purchase/details/${orderId}`).pipe(map(res => res));
  }

  submitItemDetails(data: any) {
    return this.http.post('purchase/item/details/update', data).toPromise();
  }

  deleteItemDetails(data: any) {
    return this.http.post('purchase/item/delete', data).toPromise();
  }
}
