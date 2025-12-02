import { Component, OnInit } from '@angular/core';
import { MasterReportService } from '../master-report.service';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, catchError, tap, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { SaleReportFilter } from '../../models/sale.model';
import { DatePipe } from '@angular/common';
import { FORMAT_SEARCH } from 'src/app/common/_classes/functions';
import { SaleService } from '../../services/sale.service';
import * as $ from "jquery";
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-master-sale-report',
  templateUrl: './master-sale-report.component.html',
  styleUrls: ['./master-sale-report.component.css']
})
export class MasterSaleReportComponent implements OnInit {
  currency = '৳';
  loader: boolean;
  loader_sub: boolean;
  sub: Subscription;
  companyList: any[] = [];
  salesPersonList: any[] = [];
  saleList = [];
  filterItem: SaleReportFilter;
  dateRangeValue: Date[];
  nextDate = new Date();
  filter: string;
  search: boolean;
  searchData: any[] = [];
  medicineSearch: any = {
    company: '',
    search: ''
  };
  amTime = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // fTime = {1:'1',2: '2',3:'3',4: '4',5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12'};
  // time = {1: '1 AM', 2: '2 AM', 3: '3 AM', 4: '4 AM', 5: '5 AM', 6: '6 AM', 7: '7 AM', 8: '8 AM', 9: '9 AM', 10: '10 AM', 11: '11 AM', 12: '12 PM', 13: '1 PM', 14: '2 PM', 15: '3 PM', 16: '4 PM', 17: '5 PM', 18: '6 PM', 19: '7 PM', 20: '8 PM', 21: '9 PM', 22: '10 PM', 23: '11 PM', 24: '12 AM'};

  dateDetails: any = {
    start_date: "",
    end_date: ""
  };

  showEmptyTable = false;
  medicineList = [];
  paymentTypes = [];
  summary: any =
  {
    total_amount: 0,
    total_discount: 0,
    total_due: 0,
    total_invoice: 0,
    total_medicine: 0,
    dateRangeData: '00-00-0000'
  };
  customLoader = false;
  types: any;
  constructor(
    private MasterReportService: MasterReportService,
    private router: Router,
    private datePipe: DatePipe,
    private homeService: HomeService,
    private saleService: SaleService,
    private route: ActivatedRoute,
  ) {
    this.getCompanyList();
    this.getSalesPersonsList();
    this.sub = this.route.paramMap.subscribe(val => {
      this.reset();
    });
  }
  counter(i: number) {
      return new Array(i);
  }
  ngOnInit() {
    this.getPaymentTypes();
    this.getTypes();
    this.filterItem.sales_man = "0";
  }
  getPaymentTypes() {
    this.homeService.allPaymentTypes().subscribe(res => {
      this.paymentTypes = res;
    })
  }
  getTypes() {
    this.homeService.getProductType().subscribe(res => {
      this.types = res;
    })
  }
  searchProduct = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchData = [];
        this.loader_sub = true;
      }),
      switchMap(term => {
        this.loader_sub = true;
        this.medicineSearch.search = term;

        return this.getMedicineList(this.medicineSearch);
      })
    );
  };
  getMedicineList(params): any {
    if (!params && params === "") {
      this.loader_sub = false;
      return [];
    }
    return this.saleService.searchMedicineByPharmacy(params).pipe(
      map(res => {
        this.medicineList = [];
        this.loader_sub = false;
        this.searchData = res;
        for (let s of res) {
          this.medicineList.push(s.name);
        }
        return this.medicineList;
      }),
      catchError(() => {
        this.loader_sub = false;
        return [];
      })
    );
  }
  dateFormate() {
    let dateRange = [];
    for (let d of this.filterItem.sale_date) {
      dateRange.push(this.datePipe.transform(new Date(d), "yyyy-MM-dd"));
    }
    this.filterItem.sale_date = dateRange;
  }
  getMedicineId() {
    for (let s of this.searchData) {
      if (s.name == this.filterItem.product) {
        this.filterItem.product_id = s.id;
      }
    }
  }

  filterList() {
    if (this.filterItem.sale_date) {
      this.dateFormate();
      this.dateDetails.start_date = this.filterItem.sale_date[0];
      this.dateDetails.end_date = this.filterItem.sale_date[1];
    }
    if (this.filterItem.product) {
      this.getMedicineId();
    }
    this.filter = FORMAT_SEARCH(this.filterItem);
    if (this.filter) {
      this.getSalesList();
      this.search = true;
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
      this.salesPersonList = response.data;
    });
  }

  getSalesList(){
    this.customLoader = true;
    $('#filter-medicine-btn').attr("disabled", true);	
    this.MasterReportService.searchSaleList(this.filter).pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.saleList = response.data;
      this.customLoader = false;
      $('#filter-medicine-btn').attr("disabled", false);
      if(!this.saleList.length){
        this.showEmptyTable = true;
      }else{
        this.showEmptyTable = false;
      }
      this.summary = response.summary;
    });
  }

  company_search = (company$: Observable<string>) =>
  company$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.companyList.filter(name => name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  reset() {
    this.filterItem = new SaleReportFilter();
    this.filterItem.sales_man = "0";
    this.filter = null;
    this.nextDate.setDate(this.nextDate.getDate() - 7);
    this.filterItem.sale_date = [this.nextDate, new Date()];
    this.filterList();
  }

  genericData: any[] = [];
  genericSearch: any = {
    search: ""
  };
  generic_search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.genericData = [];
      }),
      switchMap(term => {
        this.genericSearch.search = term;
        return this.getGenericList(this.genericSearch);
      })
    );
  };

  getGenericList(params): any {
    if (!params && params === "") {
      return [];
    }
    return this.saleService.getGenericList(params).then(res => {
      return this.genericData = res;
    });
  }

}
