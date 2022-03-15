import { HomeService } from 'src/app/home/services/home.service';
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { HttpService } from "../common/modules/http-with-injector/http.service";
import { UserData } from "../common/modules/auth/auth.module";
import { dcrypt } from "../common/_classes/functions";
@Injectable()
export class AuthService {
  user: any;
  lastclear: any;
  time_now: any;
  count: any;
  checkingTime = 1000 * 60 * 60 * 24;
  // checkingTime = 1000 * 60 * 1;
  subscriptionDay: any;
  constructor(
    private router: Router,
    private http: HttpService,
    private homeService: HomeService
  ) { }

  login(data: any): Observable<any> {
    return this.http.post("auth/login", data);
  }

  isAuthenticated() {
    if (this.authenticated && this.storeUser) {
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }
  checkSubscription() {
    this.homeService.subscriptionPlan().then(res => {
      if (res.status) {
        localStorage.setItem('subscriptionDay', res.data.subscription_period);
        localStorage.setItem('count', res.data.subscription_count);
        this.homeService.setSubscriptionFlag(res.data.subscription_count, res.data.subscription_period);
      }
    })
    this.lastclear = localStorage.getItem('lastclear');
    this.count = localStorage.getItem('count');
    this.subscriptionDay = localStorage.getItem('subscriptionDay');
    this.time_now = (new Date()).getTime();
    if (this.count === 'null') {
      this.count = 0;
    }
    // .getTime() returns milliseconds so 1000 * 60 * 60 * 24 = 24 days
    if ((this.time_now - this.lastclear) > this.checkingTime) {
      let diff = this.time_now - this.lastclear;
      let mult = diff / this.checkingTime;
      let countValue = parseInt(JSON.stringify(mult), 10);
      console.log(this.count);
      this.count = parseInt(this.count) + countValue;
      console.log('count')
      console.log(this.count)
      console.log(this.subscriptionDay)
      this.homeService.setSubscriptionFlag(this.count, this.subscriptionDay);
      localStorage.setItem('count', JSON.stringify(this.count));
      localStorage.setItem('lastclear', this.time_now);
      this.homeService.subscriptionCount({ 'count': this.count }).then();
    }
  }

  get authenticated(): boolean {
    const user = this.getUser();
    if (user && user["email"]) {
      return true;
    }
    return false;
  }

  get storeUser(): boolean {
    const user = this.getUser();
    const type = ["ADMIN", "PHARMACYADMIN", "PHARMACYSUPERADMIN"];
    // return user && type.includes(user.user_type) ? true : false;
    return user ? true : false;
  }

  checkAcl(page) {
    let aclList = {
      dashboard: ["ADMIN", "SALESMAN", "OWNER"],
      subscription: ["ADMIN", "OWNER"],
      user: ["ADMIN", "OWNER"],
      sale: ["ADMIN", "SALESMAN", "OWNER"],
      shortkey: ["ADMIN", "SALESMAN", "OWNER"],
      purchase: ["ADMIN", "SALESMAN", "OWNER"],
      stock: ["ADMIN", "SALESMAN", "OWNER"],
      product: ["ADMIN", "SALESMAN", "OWNER"],
      due: ["ADMIN", "SALESMAN", "OWNER"],
      report: ["ADMIN", "OWNER"]
    };
    const user = this.getUser();
    return user && aclList[page].includes(user.user_type) ? true : false;
  }

  getUser(): UserData {
    return JSON.parse(
      localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
    );
  }

  setUser(user) {
    const current_user = JSON.stringify(user);
    localStorage.setItem("currentUser", current_user);
    sessionStorage.setItem("currentUser", current_user);
  }

  getToken(): string | boolean {
    const current_user = this.getUser();
    if (current_user) {
      const splitToken = current_user.token.split(".");
      const token = splitToken
        .map((m, i) => {
          return (i + 1) % 2 === 0 ? dcrypt(m, "upper") : dcrypt(m);
        })
        .join(".");
      //return token.trim();
      return current_user.token;
    }
    return false;
  }

  getErrorMessage(err: HttpErrorResponse) {
    return this.http.getErrorMessage(err);
  }
}
