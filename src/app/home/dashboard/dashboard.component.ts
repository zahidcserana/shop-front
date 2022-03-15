import { Component, OnInit } from '@angular/core';
import { DashboardModel } from '../models/dashboard.model';
import { StockChart } from 'angular-highcharts';
import { HomeService } from '../services/home.service';
import { ScriptLoaderService } from 'src/app/common/script-loader.service';
import { ActivatedRoute } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summary: DashboardModel = new DashboardModel();
  order: StockChart;
  sale: StockChart;
  statistics;
  orderData = [];
  saleData = [];
  medicineList: any[];
  loader_sub: boolean;
  searchData: any;
  sale_details: any[];
  expired_list: any[];
  top_company: any[];
  purchaseItem: any;
  batchNo: any;
  constructor(
    private homeService: HomeService,
    private _script: ScriptLoaderService,
    private route: ActivatedRoute,
  ) {
  }

  expiredDetails: any = {
    total_expired: 0,
    total_expired_one_month: 0,
    total_expired_three_month: 0
  };

  ngOnInit() {
    this.homeService.navigationTo();
    this.getExpiryMedicineSummary();
    this.getSummary();
    // this.statistics = this.route.data.subscribe(
    //   val => {
    //     this.statistics = val && val['dashboard'] ? val['dashboard'] : [];
    //     this.orderData = this.statistics.order;
    //     this.saleData = this.statistics.sale;
    //   }
    // );
    //this.getOrderChart();
    //this.getSaleChart();
  }
  getSummary() {
    this.homeService.getSummary()
      .subscribe((res) => {
        this.summary = res;
      });
  }

  getExpiryMedicineSummary(){
    this.homeService.getExpiryMedicineSummery()
      .subscribe((res) => {
        this.expiredDetails.total_expired = res.total_expired;
        this.expiredDetails.total_expired_one_month = res.total_expired_one_month;
        this.expiredDetails.total_expired_three_month = res.total_expired_three_month;
        this.sale_details = res.sale_details;
        this.expired_list = res.expired_list;
        this.top_company = res.top_company;
        //console.log(this.sale_details)
    });
  }
  
  // getOrderChart() {
  //   this.order = new StockChart({
  //     title: {
  //       // text: 'Purchase Chart'
  //     },
  //     rangeSelector: {
  //       selected: 0,
  //       inputEnabled: false
  //     },
  //     series: [{
  //       tooltip: {
  //         valueDecimals: 2
  //       },
  //       name: 'Purchase',
  //       data: this.orderData,
  //       type: undefined
  //     }]
  //   });
  // }

  // getSaleChart() {
  //   this.sale = new StockChart({
  //     title: {
  //       // text: 'Sale Chart'
  //     },
  //     rangeSelector: {
  //       selected: 0,
  //       inputEnabled: false
  //     },
  //     series: [{
  //       tooltip: {
  //         valueDecimals: 2
  //       },
  //       name: 'Sale',
  //       data: this.saleData,
  //       type: undefined
  //     }]
  //   });
  // }
}
