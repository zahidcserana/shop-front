import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class DamageListService {
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
      .get(`damages/list?page_no=${p ? p : 1}&limit=${l ? l : 20}${params}`)
      .pipe(map(res => res));
  }
  getPurcheseDetails(orderId: any){
    return this.http.get(`damages/details/${orderId}`).pipe(map(res => res));
  }
  deleteDamageDetails(data: any) {
    return this.http.post('damages/delete', data).toPromise();
  }
}
