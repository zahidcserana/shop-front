import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class ProductService {
  constructor(private http: HttpService) {}
  searchProductType(search) {
    return this.http.get("type/search", { params: search });
  }

  getProductList(){
    return this.http.get(`product/list`).pipe(map(res => res));
  }

  getProductType() {
    return this.http.get(`type/list`).pipe(map(res => res));
  }

  getCompanyList(){
    return this.http.get(`company-list`).pipe(map(res => res));
  }

  submitProduct(data: any) {
    return this.http.post('product/save', data).toPromise();
  }

  getInventoryFilterList(params){
    return this.http.get(`inventory/listFilter?filter=${params}`).pipe(map(response => response));
  }
}
