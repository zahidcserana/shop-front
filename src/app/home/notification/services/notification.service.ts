import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class NotificationService {
  constructor(private http: HttpService) {}
  searchMedicine(search) {
    return this.http.get("medicines/search", { params: search });
  }

  getNotificationList(){
    return this.http.get(`notification/list/all`).pipe(map(res => res));
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
}
