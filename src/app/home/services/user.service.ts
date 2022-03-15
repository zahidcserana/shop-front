import { Injectable } from '@angular/core';
import { HttpService } from '../../common/modules/http-with-injector/http.service';
import { map } from "rxjs/operators";

@Injectable()
export class UserService {

  constructor(private http: HttpService) {

  }

  addUser(data: any) {
    return this.http.post('users', data).toPromise();
  }
  editUser(id, data: any) {
    return this.http.post(`users/${id}`, data).toPromise();
  }
  deleteUser(id) {
    return this.http.delete(`users/${id}`).pipe(map(res => res));
  }
  changePassword(data: any) {
    return this.http.post(`users/password`, data).toPromise();
  }
}
