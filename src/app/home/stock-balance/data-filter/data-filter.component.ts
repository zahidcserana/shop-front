import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  NgModule
} from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { FORMAT_SEARCH } from "src/app/common/_classes/functions";
import { BsDatepickerModule } from "ngx-bootstrap";
import { DatePipe } from "@angular/common";
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { StockBalanceService } from "../stock-balance.service";
import { SaleFilterModel } from "../stock-balance.model";

declare let $: any;
declare var moment: any;

@Component({
  selector: "app-data-filter",
  templateUrl: "./data-filter.component.html",
  styleUrls: ["./data-filter.component.css"]
})
export class DataFilterComponent implements OnInit {
  dateRangeValue: Date[];
  nextDate = new Date();
  saleData: SaleFilterModel;
  filter: string;
  search: boolean;
  sub: Subscription;
  @Output("loadList") loadList: EventEmitter<string> = new EventEmitter();

  constructor(private route: ActivatedRoute, private datePipe: DatePipe, private saleService: StockBalanceService) {
    this.nextDate.setDate(this.nextDate.getDate() + 7);
    this.dateRangeValue = [new Date(), this.nextDate];
    this.saleData = new SaleFilterModel();
    this.saleData.date_range = [new Date(), this.nextDate];

    this.sub = this.route.paramMap.subscribe(val => {
      this.reset();
    });
  }

  ngOnInit() {}
  ngAfterViewInit() {
    // this._dateRange();
  }
  medicineSearch: any = {
    search: ""
  };
  medicineSearchData: any;
  medicineList: any[];

  searchMedicine = (text$: Observable<string>) => {
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

  dateFormate() {
    let dateRange = [];
    for (let d of this.saleData.date_range) {
      dateRange.push(this.datePipe.transform(new Date(d), "yyyy-MM-dd"));
    }
    this.saleData.date_range = dateRange;
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
    this.saleData = new SaleFilterModel();
    this.saleData.date_start = null;
    this.saleData.date_end = null;
  }
  getMedicineId() {
    console.log(this.saleData.medicine);
    for (let s of this.medicineSearchData) {
      if (s.name == this.saleData.medicine) {
        this.saleData.medicine_id = s.id;
      }
    }
  }
  searchSaleData() {
    if (this.saleData.date_range) {
      this.dateFormate();
    }
    if (this.saleData.medicine) {
      this.getMedicineId();
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
}
