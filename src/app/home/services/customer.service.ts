import { Injectable } from '@angular/core';
import { HttpService } from '../../common/modules/http-with-injector/http.service';
import { map } from "rxjs/operators";

@Injectable()
export class CustomerService {

  constructor(private http: HttpService) {
  }

  getCustomers() {
    return this.http.get('customers').pipe(map(res => res));
  }

  addCustomer(data: any) {
    return this.http.post('customer/store', data).toPromise();
  }

  editCustomer(id, data: any) {
    return this.http.post(`customer/${id}/update`, data).toPromise();
  }

  deleteCustomer(id) {
    return this.http.delete(`customer/${id}/delete`).pipe(map(res => res));
  }
}
