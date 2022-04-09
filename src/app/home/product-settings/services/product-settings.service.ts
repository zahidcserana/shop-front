import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class ProductSettingsService {
  constructor(private http: HttpService) {}
  searchProductType(search) {
    return this.http.get("type/search", { params: search });
  }

  searchMedicine(search) {
    return this.http.get("medicines/search", { params: search });
  }

  getProductType() {
    return this.http.get(`type/list`).pipe(map(res => res));
  }

  getCompanyList(){
    return this.http.get(`company-list`).pipe(map(res => res));
  }

  getBrandList(){
    return this.http.get(`brand/list`).pipe(map(res => res));
  }

  submitItem(data: any) {
    return this.http.post('purchase/save', data).toPromise();
  }

  submitProductType(data: any) {
    return this.http.post('product/type/save', data).toPromise();
  }

  submitCompanyDetails(data: any) {
    return this.http.post('company/save', data).toPromise();
  }

  UpdateCompanyDetails(data: any) {
    return this.http.post('company/update', data).toPromise();
  }

  UpdateTypeDetails(data: any) {
    return this.http.post('type/update', data).toPromise();
  }

  saveBrand(data: any) {
    return this.http.post('brand/save', data).toPromise();
  }

  getPreviousPurchasedetails(data: any) {
    return this.http.post('purchase/previous/details', data).toPromise();
  }

  deleteType(id) {
    return this.http.delete(`type/${id}`).pipe(map(res => res));
  }
  deleteBrand(id) {
    return this.http.delete(`brand/${id}`).pipe(map(res => res));
  }
}
