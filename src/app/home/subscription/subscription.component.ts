import { HomeService } from 'src/app/home/services/home.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import * as $ from "jquery";

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  subscriptionData: any = {
    coupon_type: '1MONTH',
    coupon_code: '',
    coupon: {
      code_1: '',
      code_2: '',
      code_3: '',
      code_4: '',
    }
  }
  subscriptionDay: any;
  @ViewChild("code1") code1: ElementRef;
  @ViewChild("code2") code2: ElementRef;
  @ViewChild("code3") code3: ElementRef;
  @ViewChild("code4") code4: ElementRef;
  subscriptionList: any;
  constructor(
    private homeService: HomeService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.code1.nativeElement.focus();
    this.route.data.subscribe(val => {
      let subscriptions = val && val["subscription"] ? val["subscription"] : [];
      this.subscriptionList = subscriptions.data.coupons;
    });
  }
  goCode2() {
    if (this.subscriptionData.coupon.code_1.length > 3) {
      this.code2.nativeElement.focus();
    }
  }
  goCode3() {
    if (this.subscriptionData.coupon.code_2.length > 3) {
      this.code3.nativeElement.focus();
    }
  }
  goCode4() {
    if (this.subscriptionData.coupon.code_3.length > 3) {
      this.code4.nativeElement.focus();
    }
  }
  crearCache() {
    Swal.fire({
      title: 'Are you sure?',
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
        // localStorage.clear();
        // sessionStorage.clear()
        window.location.reload();
      }
    })
  }
  submit() {
    this.subscriptionData.coupon_code = this.subscriptionData.coupon.code_1 +
      this.subscriptionData.coupon.code_2 +
      this.subscriptionData.coupon.code_3 +
      this.subscriptionData.coupon.code_4;
    console.log(this.subscriptionData);
    this.homeService.subscription(this.subscriptionData).then(res => {
      if (res.status) {
        Swal.fire({
          position: "center",
          type: "success",
          title: "Subscription successfully updated.",
          showConfirmButton: false,
          timer: 3000
        });
        localStorage.setItem('subscriptionOvar', 'false');
        this.getSubscriptionPlan();
        // this.getSubscriptions();
        $("#myForm").trigger("reset");
        window.location.reload();
      } else {
        Swal.fire({
          type: "warning",
          title: "Oops...",
          text: res.message,
          showConfirmButton: false,
          timer: 1500
        });
      }
    })
  }
  getSubscriptions() {
    this.homeService.getSubscriptions().then(res => {
      this.subscriptionList = res.data.coupons;
    })
  }

  getSubscriptionPlan() {
    this.homeService.subscriptionPlan().then(res => {
      if (res.status) {
        localStorage.setItem('subscriptionDay', res.data.subscription_period);
        localStorage.setItem('count', res.data.subscription_count);
        this.homeService.setSubscriptionFlag(res.data.subscription_count, res.data.subscription_period);
      }
    })
  }
}
