import { ProductService } from './../../../product/services/product.service';
import { HomeService } from './../../../services/home.service';
import { SaleService } from './../../../services/sale.service';
import { ExpiryFilterModel } from './../../../models/report.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FORMAT_SEARCH } from 'src/app/common/_classes/functions';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-expiry-filter',
  templateUrl: './expiry-filter.component.html',
  styleUrls: ['./expiry-filter.component.css']
})
export class ExpiryFilterComponent implements OnInit {

  dateRangeValue: Date[];
  nextDate = new Date();
  searchData: ExpiryFilterModel;
  filter: string;
  medicineSearch: any = {
    search: ""
  };
  medicineSearchData: any;
  CompanySearchData: any;
  sub: Subscription;
  @Output("loadList") loadList: EventEmitter<string> = new EventEmitter();
  medicineList: any[];
  companyList: any;
  loader: boolean;

  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService,
    private datePipe: DatePipe,
    private productService: ProductService
  ) {
    this.nextDate.setDate(this.nextDate.getDate() + 7);
    this.dateRangeValue = [new Date(), this.nextDate];
    this.searchData = new ExpiryFilterModel();
    this.searchData.expiry_date = [new Date(), this.nextDate];

    this.sub = this.route.paramMap.subscribe(val => {
      this.reset();
    });
  }

  ngOnInit() {
    this.getCompanyList();
  }

  getMedicineId() {
    console.log(this.searchData.medicine);
    for (let s of this.medicineSearchData) {
      if (s.name == this.searchData.medicine) {
        this.searchData.medicine_id = s.id;
      }
    }
  }
  getCompanyId() {
    for (let s of this.CompanySearchData) {
      if (s.name == this.searchData.company) {
        this.searchData.company_id = s.id;
      }
    }
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.medicineSearchData = [];
        // this.loader_sub = true;
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
  getMedicineList(params): any {
    if (!params && params === "") {
      // this.loader_sub = false;
      return [];
    }
    return this.saleService.searchMedicineByPharmacy(params).pipe(
      map(res => {
        this.medicineList = [];
        // this.loader_sub = false;
        this.medicineSearchData = res;
        for (let s of res) {
          this.medicineList.push(s.name);
        }
        return this.medicineList;
      }),
      catchError(() => {
        // this.loader_sub = false;
        return [];
      })
    );
  }

  company_search = (company$: Observable<string>) =>
    company$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.companyList.filter(name => name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  getCompanyList() {
    this.productService.getCompanyList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.companyList = [];
      this.CompanySearchData = response;
      for (let s of response) {
        this.companyList.push(s.name);
      }
      return this.companyList;
    });
  }

  dateFormate() {
    let dateRange = [];
    for (let d of this.searchData.expiry_date) {
      dateRange.push(this.datePipe.transform(new Date(d), "yyyy-MM-dd"));
    }
    this.searchData.expiry_date = dateRange;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode("day");
  }

  reset() {
    this.searchData = new ExpiryFilterModel();
  }
  dataSearch() {
    if (this.searchData.expiry_date) {
      this.dateFormate();
    }
    if (this.searchData.medicine) {
      this.getMedicineId();
    }
    if (this.searchData.company) {
      this.getCompanyId();
    }
    this.filter = FORMAT_SEARCH(this.searchData);
    if (this.filter) {
      this.loadList.emit(this.filter);
      // this.search = true;
    }
  }
  resetSearch() {
    this.reset();
    this.filter = null;
    if (this.search) {
      this.loadList.emit("");
      // this.search = false;
    }
  }
}
