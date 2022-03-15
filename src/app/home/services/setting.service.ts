import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class SettingService {
  constructor(private http: HttpService) {}

  getProducts(p, l, query?) {
    const params = query ? query : '';
    return this.http
      .get(`products/master-list?page_no=${p ? p : 1}&limit=${l ? l : 20}${params}`)
      .pipe(map(res => res));
  }
  deleteProduct(id) {
    return this.http.get(`products/${id}/delete`).toPromise();
  }
  editProduct(id, data: any) {
    return this.http.post(`products/${id}`, data).toPromise();
  }
}
