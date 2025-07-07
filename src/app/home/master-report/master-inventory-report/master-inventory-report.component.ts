import { Component, OnInit } from '@angular/core';
import { MasterReportService } from '../master-report.service'
import { map, catchError, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as $ from "jquery";
import { ActivatedRoute } from '@angular/router';
import { FORMAT_SEARCH } from 'src/app/common/_classes/functions';
import { StockFilterModel } from '../../models/report.model';

@Component({
  selector: 'app-master-inventory-report',
  templateUrl: './master-inventory-report.component.html',
  styleUrls: ['./master-inventory-report.component.css']
})
export class MasterInventoryReportComponent implements OnInit {
  filterItem: StockFilterModel;
  filter: string;

  dateRangeValue: Date[];
  nextDate = new Date();
  sub: Subscription;

   constructor(
      private route: ActivatedRoute,
      private MasterReportService: MasterReportService,
      private datePipe: DatePipe,
   ) {
    this.nextDate.setDate(this.nextDate.getDate());
    this.dateRangeValue = [new Date(), this.nextDate];
    this.filterItem = new StockFilterModel();
    this.filterItem.date_range = [new Date(), this.nextDate];

    this.sub = this.route.paramMap.subscribe(val => {
      // this.reset();
    });
  }

  // reset() {
  //   this.filterItem.date_range = null;
  // }

  ngOnInit() {
    this.getInventoryList();
    this.getCompanyList();
  }

  loader: boolean;
  loader_sub: boolean;
  inventoryList = [];
  companyList: any[] = [];
  medicineList = [];
  typeList = [];

  searchData: any[] = [];
  typeSearchData: any[] = [];
  medicineSearch: any = {
    search: ""
  };

  typeSearch: any = {
    search: ""
  };

  summary: any = {
    company: 0,
    tp: 0,
    mrp: 0,
    profit: 0,
    total_medicine: 0,
  }

  customLoader = true;

  filterList() {
    if (this.filterItem.date_range) {
      this.dateFormate();
    }

    for (let medicine of this.searchData) {
      if (medicine.name == this.filterItem.medicine) {
        this.filterItem.medicine_id = medicine.id;
      }
    }

    if (this.filterItem.medicine_id || this.filterItem.date_range){
      this.loader = true;
     
      this.filter = FORMAT_SEARCH(this.filterItem);
     
      this.customLoader = true;
      $('#filter-medicine-btn').attr("disabled", true);	
      this.MasterReportService.getInventoryList(this.filter).pipe(map(response => {
        return response;
      }), catchError(err => {
        this.loader = false;
        return of([]);
      })).subscribe(response => {
        this.loader = false;
        this.customLoader = false;
        $('#filter-medicine-btn').attr("disabled", false);	
        this.inventoryList = response.data;
        this.calculateSummary(response.summary);
      });
    }
  }

  dateFormate() {
    let dateRange = [];
    for (let d of this.filterItem.date_range) {
      dateRange.push(this.datePipe.transform(new Date(d), "yyyy-MM-dd"));
    }
    this.filterItem.date_range = dateRange;
  }

  resetList(){
    this.filterItem = new StockFilterModel();
    this.getInventoryList();
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

  getInventoryList(){
    this.customLoader = true;
    this.MasterReportService.getInventoryList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.customLoader = false;
      this.inventoryList = response.data;
//       var totalmrp= response.data.reduce((accum,item) => accum + item.mrp, 0);
// console.log(totalmrp);
      this.calculateSummary(response.summary);
      // this.summary.tp = response.summary.total_tp;
      // this.summary.mrp = response.summary.total_mrp;
      // this.summary.profit = response.summary.total_profit;
      // this.summary.total_medicine = response.summary.total_quantity;

    });
  }

  calculateSummary(summary) {
    // var lookup = {};
    // var result = [];
    // var qty = 0;
    // var mrp = 0;
    // var tp = 0;

    // items.forEach(function (element, index, item) {
    //   console.log(element.quantity)
    //   // var name = item.company_name;
    //   qty = qty + element.quantity;
    //   mrp = mrp + element.mrp;
    //   tp = tp + element.tp;
    //   console.log(qty);

    //   // if (!(name in lookup)) {
    //   //   lookup[name] = 1;
    //   //   result.push(name);
    //   // }
    // });

    // for (var item, i = 0; item = items[i++];) {
    //   var name = item.company_name;
    //   qty = qty + item.quantity;
    //   mrp = mrp + item.mrp;
    //   tp = tp + item.tp;
    //
    //   if (!(name in lookup)) {
    //     lookup[name] = 1;
    //     result.push(name);
    //   }
    // }
    // this.summary.company = result.length;
    this.summary.tp = summary.total_tp;
    this.summary.mrp = summary.total_mrp;
    this.summary.profit = summary.total_profit;
    this.summary.total_medicine = summary.quantity;
    console.log(this.summary);
  }

  company_search = (company$: Observable<string>) =>
  company$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.companyList.filter(name => name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchData = [];
        this.loader_sub = true;
      }),
      switchMap(term => {
        this.medicineSearch.search = term;
        if (this.medicineSearch.search.length > 1) {
          return this.getMedicineList(this.medicineSearch);
        }
        return [];
      })
    );
  };

  search_type = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.typeSearchData = [];
        this.loader_sub = true;
      }),
      switchMap(term => {
        this.loader_sub = true;
        this.typeSearch.search = term.trim();
        return this.getTypeList(this.typeSearch);
      })
    );
  };

  getTypeList(params): any {
    if (!params && params === "") {
      this.loader_sub = false;
      return [];
    }

    return this.MasterReportService.searchProductType(params).pipe(
      map(res => {
        this.typeList = [];
        this.loader_sub = false;
        this.typeSearchData = res;
        for (let medicine of res) {
          this.typeList.push(medicine.name);
        }
        return this.typeList;
      }),
      catchError(() => {
        this.loader_sub = false;
        return [];
      })
    );
  };

  getMedicineList(params): any {
    if (!params && params === "") {
      this.loader_sub = false;
      return [];
    }

    return this.MasterReportService.searchMedicine(params).pipe(
      map(res => {
        this.medicineList = [];
        this.loader_sub = false;
        this.searchData = res;
        for (let medicine of res) {
          this.medicineList.push(medicine.name);
        }
        return this.medicineList;
      }),
      catchError(() => {
        this.loader_sub = false;
        return [];
      })
    );
  }

}