import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class PurchaseService {
  constructor(private http: HttpService) {}
  searchMedicine(search) {
    return this.http.get("medicines/search", { params: search });
  }

  getCompanyList(){
    return this.http.get(`company-list`).pipe(map(res => res));
  }

  submitItem(data: any) {
    return this.http.post('purchase/save', data).toPromise();
  }

  getPreviousPurchasedetails(data: any) {
    return this.http.post('purchase/previous/details', data).toPromise();
  }

  getUnitPriceDetails(data: any) {
    return this.http.post('item/unit/details', data).toPromise();
  }

}
