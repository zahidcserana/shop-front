import { HomeService } from 'src/app/home/services/home.service';
import { AuthService } from "src/app/auth/auth.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  subscriptionPeriod = true;
  user: any;
  logoUrl: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private homeService: HomeService,
    public langService: LanguageService,
    public config: AppConfigService
  ) {
    this.config.loadFromStorage()
  }

  toggleLanguage() {
    const newLang = this.langService.currentLang === 'en' ? 'bn' : 'en';
    this.langService.switchLang(newLang);
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("currentUser"));

    const logoPath = this.user.logo;

    this.logoUrl = logoPath ? logoPath : 'assets/images/logo3.png';

    this.subPlane();
    this.getNotificationList();
  }

  subPlane() {
    // if(localStorage.getItem('isReload') === 'true') {
    //   window.location.reload();
    //   localStorage.setItem('isReload', 'false');
    // }
    // this.homeService.setSubscriptionFlag(localStorage.getItem('count'), localStorage.getItem('subscriptionDay'));
    if (localStorage.getItem('subscriptionOff') === 'true') {
      this.subscriptionPeriod = false;
    }
  }

  loader: boolean;
  searchData: any[] = [];
  loader_sub: boolean;
  allNotificationList: any[] = [];

  checkAcl(page) {
    return this.authService.checkAcl(page);
  }
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_cart");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("subscriptionOff");
    localStorage.removeItem("subscriptionOvar");
    sessionStorage.removeItem("currentUser");
    this.router.navigate(["/login"]);
    window.location.reload();
  }
  dataSync() {
    // this.purchaseDataSync();
    // this.saleDataSync();
    Swal.fire({
      position: "center",
      type: "success",
      title: "Data successfully synced.",
      showConfirmButton: false,
      timer: 1500
    });
    // setTimeout(() => { window.location.reload(); }, 3000);
  }

  purchaseDataSync() {
    this.homeService.dataSyncToServe().then(res => {
      console.log('purchase data successfully synced');
    });
  }
  saleDataSync() {
    this.homeService.saleDataSyncToServe().then(res => {
      console.log('purchase data successfully synced');
    });
  }

  getNotificationList(){
    this.homeService.getNotificationList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.allNotificationList = response.data;
    });
  }
}
