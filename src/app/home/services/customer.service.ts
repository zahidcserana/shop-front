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
    return this.http.post('customers/store', data).toPromise();
  }

  editCustomer(id, data: any) {
    return this.http.post(`customers/${id}/update`, data).toPromise();
  }

  deleteCustomer(id) {
    return this.http.delete(`customers/${id}/delete`).pipe(map(res => res));
  }

  listDocuments(id) {
    return this.http.get(`customers/${id}/documents`).pipe(map(res => res));
  }

  uploadDocuments(id, payload: FormData) {
    return this.http.post(`customers/${id}/documents`, payload).pipe(map(res => res));
  }

  deleteDocument(customerId, documentId) {
    return this.http.delete(`customers/${customerId}/documents/${documentId}/delete`).pipe(map(res => res));
  }
}
