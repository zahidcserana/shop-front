import { Injectable } from '@angular/core';
import { HttpService } from '../../common/modules/http-with-injector/http.service';
import { map } from "rxjs/operators";

@Injectable()
export class SupplierService {

  constructor(private http: HttpService) {
  }

  addSupplier(data: any) {
    return this.http.post('supplier/store', data).toPromise();
  }
  editSupplier(id, data: any) {
    return this.http.post(`supplier/${id}/update`, data).toPromise();
  }
  deleteSupplier(id) {
    return this.http.delete(`supplier/${id}/delete`).pipe(map(res => res));
  }
}
