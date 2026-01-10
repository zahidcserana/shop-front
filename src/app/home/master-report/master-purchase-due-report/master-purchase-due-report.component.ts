import { Component, OnInit } from '@angular/core';
import { MasterReportService } from '../master-report.service'
import { map, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-master-purchase-due-report',
  templateUrl: './master-purchase-due-report.component.html',
  styleUrls: ['./master-purchase-due-report.component.css']
})
export class MasterPurchaseDueReportComponent implements OnInit {
  currency = '৳';

  constructor(
    private MasterReportService: MasterReportService,
    private datePipe: DatePipe,
    public config: AppConfigService
    ) { }

  ngOnInit() {
    this.getPurcheseDueList();
    this.getCompanyList();
    this.getSalesPersonsList();
  }

  loader: boolean;
  loader_sub: boolean;
  purchaseList = [];
  purchaseDetails: any;
  purchase: any;
  companyList: any[] = [];
  salesPersonList: any[] = [];

  filterItem: any =
  {
    company: "",
    invoice: "",
    sales_man: 0,
    product: "",
    status: 0,
    purchase_date: "",
    start_date: "",
    end_date: "",
  }

  summary: any =
  {
    total_amount: 0,
    total_discount: 0,
    total_due: 0
  }

  customLoader = true;
  showEmptyTable = false;

  getPurcheseDueList(){
    this.customLoader = true;
    this.MasterReportService.getPurcheseDueList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.customLoader = false;
      this.purchaseList = response.data;
      if(!this.purchaseList.length){
        this.showEmptyTable = true;
      }else{
        this.showEmptyTable = false;
      }
      this.claculateSummary(this.purchaseList);
    });
  }

  claculateSummary(data){
    var sub_total = 0;
    var sub_discount = 0;
    var sub_due = 0;

    data.forEach((item, index) => {
      sub_total = sub_total + Number(item.total_amount);
      sub_discount = sub_discount + Number(item.discount);
      sub_due = sub_due + Number(item.total_due_amount);
    });
    this.summary.total_amount = sub_total;
    this.summary.total_discount = sub_discount;
    this.summary.total_due = sub_due;
  }

  filterPurcheseList(){
    let dateRange = [];
      for (let d of this.filterItem.purchase_date) {
        dateRange.push(this.datePipe.transform(new Date(d), "yyyy-MM-dd"));
      }
      this.filterItem.purchase_date = dateRange;

      if(this.filterItem.purchase_date.length){
        this.filterItem.start_date = this.filterItem.purchase_date[0];
        this.filterItem.end_date = this.filterItem.purchase_date[1];
      }

      if(this.filterItem.purchase_date.length || this.filterItem.invoice || this.filterItem.company || this.filterItem.customer_name || this.filterItem.customer_mobile || this.filterItem.product || this.filterItem.status || this.filterItem.sales_man){
        let allParams = {
          'details': this.filterItem,
        }

        this.customLoader = true;
        this.MasterReportService.searchPurcheseDueList(allParams)
        .then(response => {
          this.loader = false;
          this.customLoader = false;
          this.purchaseList = response.data;
          if(!this.purchaseList.length){
            this.showEmptyTable = true;
          }else{
            this.showEmptyTable = false;
          }
          this.claculateSummary(this.purchaseList);
        })
        .catch(err => {
          console.log(err)
        });
      }
  }

  getCompanyList(){
    this.MasterReportService.getCompanyList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.companyList = response;
    });
  }

  getSalesPersonsList(){
    this.MasterReportService.getSalesPersonsList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      //console.log(response.data);
      this.salesPersonList = response.data;
    });
  }

  getSize(product){
    return product.length;
  }

  company_search = (company$: Observable<string>) =>
  company$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.companyList.filter(name => name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  resetList(){
    this.getPurcheseDueList();
    this.filterItem = {
      company: "",
      invoice: "",
      sales_man: 0,
      product: "",
      status: 0,
      purchase_date: "",
      start_date: "",
      end_date: "",
    }
  }

}
