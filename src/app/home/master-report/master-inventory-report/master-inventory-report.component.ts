import { Component, OnInit } from '@angular/core';
import { MasterReportService } from '../master-report.service'
import { map, catchError, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as $ from "jquery";

@Component({
  selector: 'app-master-inventory-report',
  templateUrl: './master-inventory-report.component.html',
  styleUrls: ['./master-inventory-report.component.css']
})
export class MasterInventoryReportComponent implements OnInit {

  constructor(
    private MasterReportService: MasterReportService,
    private datePipe: DatePipe,
  ) { }

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

  filterItem: any = {
    medicine: '',
    medicine_id: '',
    company: '',
    quantity: '',
    type: '',
    type_id: '',
    low_stock_qty: false,
  }

  summary: any = {
    company: 0,
    tp: 0,
    mrp: 0,
    profit: 0,
    total_medicine: 0,
  }

  customLoader = true;

  filterList() {
    for (let medicine of this.searchData) {
      if (medicine.name == this.filterItem.medicine) {
        this.filterItem.medicine_id = medicine.id;
      }
    }

    if (this.filterItem.medicine_id || this.filterItem.quantity || this.filterItem.type || this.filterItem.low_stock_qty){
      this.loader = true;
      for (let type of this.typeSearchData) {
        if (type.name == this.filterItem.type) {
          this.filterItem.type_id = type.id;
        }
      }
      this.customLoader = true;
      $('#filter-medicine-btn').attr("disabled", true);	
      this.MasterReportService.getInventoryFilterList(JSON.stringify(this.filterItem)).pipe(map(response => {
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

  resetList(){
    this.getInventoryList();
    this.filterItem = {
      medicine: '',
      medicine_id: '',
      company: '',
      quantity: '',
      type: '',
      type_id: '',
      low_stock_qty: false,
    };
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