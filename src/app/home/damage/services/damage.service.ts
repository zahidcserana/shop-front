import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class DamageService {
  constructor(private http: HttpService) {}
  searchMedicine(search) {
    return this.http.get("medicines/search", { params: search });
  }
  getCompanyList(){
    return this.http.get(`company-list`).pipe(map(res => res));
  }
  submitItem(data: any) {
    return this.http.post('damages/store', data).toPromise();
  }
  getPreviousDamagedetails(data: any) {
    return this.http.post('damages/product_details', data).toPromise();
  }
}
