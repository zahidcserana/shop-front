import { SaleService } from './../../../services/sale.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SaleReportFilter } from 'src/app/home/models/sale.model';
import { Subscription, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FORMAT_SEARCH } from 'src/app/common/_classes/functions';
import { distinctUntilChanged, debounceTime, map, tap, switchMap, catchError } from 'rxjs/operators';
import { HomeResolveService } from 'src/app/home/services/home-resolve.service';
import { HomeService } from 'src/app/home/services/home.service';
import { ProductService } from 'src/app/home/product/services/product.service';

declare let $: any;
declare var moment: any;

@Component({
  selector: 'app-sale-report-filter',
  templateUrl: './sale-report-filter.component.html',
  styleUrls: ['./sale-report-filter.component.css']
})
export class SaleReportFilterComponent implements OnInit {
  dateRangeValue: Date[];
  nextDate = new Date();
  saleData: SaleReportFilter;
  filter: string;
  sub: Subscription;
  @Output("loadList") loadList: EventEmitter<string> = new EventEmitter();
  companyList: any[] = [];
  loader_sub: boolean;
  medicineSearch: any = {
    company: '',
    search: ''
  };
  searchData: any[] = [];
  companySearchData: any[] = [];
  search: any;
  medicineList = [];
  typeListData: any[] = [];
  typeSearch: any = {
    search: ""
  };
  typeList = [];

  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService,
    private datePipe: DatePipe,
    private homeService: HomeService,
    private productService: ProductService,
    ) {
    this.nextDate.setDate(this.nextDate.getDate() + 7);
    this.dateRangeValue = [new Date(), this.nextDate];
    this.saleData = new SaleReportFilter();
    this.saleData.sale_date = [new Date(), this.nextDate];

    this.sub = this.route.paramMap.subscribe(val => {
      this.reset();
    });
  }

  ngOnInit() {
   this.homeService.getCompaniesByInventory().subscribe((res) => {
    this.companySearchData = res;
    for (let s of res) {
      this.companyList.push(s.name);
    }
  });

    console.log('companyList');
    console.log(this.companyList);
  }
  getCompanyId() {
    for (let s of this.companySearchData) {
      if (s.name == this.saleData.company) {
        this.saleData.company_id = s.id;
        this.saleData.company = s.company;
      }
    }
  }

  dateFormate() {
    let dateRange = [];
    for (let d of this.saleData.sale_date) {
      dateRange.push(this.datePipe.transform(new Date(d), "yyyy-MM-dd"));
    }
    this.saleData.sale_date = dateRange;
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
    this.saleData = new SaleReportFilter();
    this.saleData.date_start = null;
    this.saleData.date_end = null;
  }
  searchSaleData() {
    if (this.saleData.sale_date) {
      this.dateFormate();
    }
    if (this.saleData.company) {
      this.getCompanyId();
    }
    if (this.saleData.product) {
      this.getMedicineId();
    }
    if (this.saleData.product_type) {
      this.getTypeId();
    }
    this.filter = FORMAT_SEARCH(this.saleData);
    if (this.filter) {
      this.loadList.emit(this.filter);
      this.search = true;
    }
  }
  resetSearch() {
    this.reset();
    this.filter = null;
    if (this.search) {
      this.loadList.emit("");
      this.search = false;
    }
  }

  getTypeList(params): any {
    if (!params && params === "") {
      this.loader_sub = false;
      return [];
    }

    return this.productService.searchProductType(params).pipe(
      map(res => {
        this.typeList = [];
        this.loader_sub = false;
        this.typeListData = res;
        for (let type of res) {
          this.typeList.push(type.name);
        }
        return this.typeList;
      }),
      catchError(() => {
        this.loader_sub = false;
        return [];
      })
    );
  };


  searchType = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchData = [];
        this.loader_sub = true;
      }),
      switchMap(term => {
        this.loader_sub = true;
        this.typeSearch.search = term.trim();
        return this.getTypeList(this.typeSearch);
      })
    );
  };

  company_search = (company$: Observable<string>) =>
    company$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.companyList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

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

    getMedicineId() {
      console.log(this.saleData.product);
      for (let s of this.searchData) {
        if (s.name == this.saleData.product) {
          this.saleData.product_id = s.id;
        }
      }
    }
    getTypeId() {
      console.log(this.saleData.product_type);
      for (let s of this.typeListData) {
        if (s.name == this.saleData.product_type) {
          this.saleData.product_type_id = s.id;
        }
      }
    }

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

}
