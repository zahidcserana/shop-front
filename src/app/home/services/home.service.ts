import { Subscription } from 'rxjs';
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { Router } from '@angular/router';

@Injectable()
export class HomeService {
  constructor(private http: HttpService, private router: Router) { }
  getProductType() {
    return this.http.get(`type/list`).pipe(map(res => res));
  }
  getCompanies() {
    return this.http.get("companies").pipe(map(res => res));
  }
  getCompanyList() {
    return this.http.get(`company-list`).pipe(map(res => res));
  }
  getCustomers() {
    return this.http.get("customers").pipe(map(res => res));
  }
  getCompaniesByInventory() {
    return this.http.get("companies/inventory").pipe(map(res => res));
  }
  getMrs() {
    return this.http.get("mrs").pipe(map(res => res));
  }
  saleDetails(saleId: any) {
    return this.http.get(`sale/${saleId}`).pipe(map(res => res));
  }
  orderDetails(orderId: any) {
    return this.http.get(`orders/${orderId}/details`).pipe(map(res => res));
  }
  getNotifications() {
    return this.http.get(`notification/list`).pipe(map(res => res));
  }
  allUser() {
    return this.http.get(`users`).pipe(map(res => res));
  }
  allPaymentTypes() {
    return this.http.get(`payment/types`).pipe(map(res => res));
  }
  getSummary() {
    return this.http.get(`dashboard/summary`).pipe(map(res => res));
  }
  getStatistics() {
    return this.http.get(`dashboard/statistics`).pipe(map(res => res));
  }
  dataSyncToServe() {
    return this.http.get("data-sync").toPromise();
  }
  stockBalance() {
    return this.http.get("stock-balance-create").toPromise();
  }
  saleDataSyncToServe() {
    return this.http.get("sale-data-sync").toPromise();
  }
  generateLowStockNotification() {
    return this.http.post('notification/generateLowStockNotification', '').toPromise();
  }
  checkAdmin(data) {
    return this.http.post('users/admin/check', data).toPromise();
  }
  subscription(data) {
    return this.http.post('subscription', data).toPromise();
  }
  subscriptionCount(data) {
    return this.http.post('subscription-count', data).toPromise();
  }
  subscriptionPlan() {
    return this.http.get("subscription-plan").toPromise();
  }
  getSubscriptions() {
    return this.http.get("subscription-data").toPromise();
  }
  getNotificationList() {
    return this.http.get(`notification/list`).pipe(map(res => res));
  }
  getExpiryMedicineSummery() {
    return this.http.get(`expired/medicines`).pipe(map(res => res));
  }
  navigationTo() {
    if (localStorage.getItem('subscriptionOff') === 'true') {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user.user_type == 'ADMIN') {
        this.router.navigate(["/subscription"]);
      } else {
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
        this.router.navigate(["/login"]);
      }
      // window.location.reload();
    }
  }
  setSubscriptionFlag(count, subscriptionDay) {
    console.log('subscriptionOff');
    if (count > parseInt(subscriptionDay)) {
      localStorage.setItem('subscriptionOvar', 'true');
      if (count > (parseInt(subscriptionDay) + 5)) {
        localStorage.setItem('subscriptionOff', 'true');
      }
      // localStorage.clear();
    } else {
      localStorage.setItem('subscriptionOff', 'false');
    }
  }
}
