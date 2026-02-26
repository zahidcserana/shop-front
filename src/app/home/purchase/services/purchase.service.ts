import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

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

  searchBatch(medicineId: number, query: string): Observable<any[]> {
    const params = new HttpParams()
      .set('medicine_id', medicineId.toString())
      .set('q', query);

    return this.http.get("medicines/search-batch", { params });
  }

}
