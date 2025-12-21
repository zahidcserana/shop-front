import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FORMAT_SEARCH } from 'src/app/common/_classes/functions';
import { debounceTime, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { HomeService } from 'src/app/home/services/home.service';
import { DamageFilterModel } from 'src/app/home/models/dashboard.model';

@Component({
  selector: 'app-damage-list-filter',
  templateUrl: './damage-list-filter.component.html',
  styleUrls: ['./damage-list-filter.component.css']
})
export class DamageListFilterComponent implements OnInit {

  dateRangeValue: Date[];
  nextDate = new Date();
  saleData: DamageFilterModel;
  filter: string;
  search: boolean;
  companySearchData: any[] = [];
  sub: Subscription;
  companyList: any[] = [];

  @Output("loadList") loadList: EventEmitter<string> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    private datePipe: DatePipe
  ) {
    this.nextDate.setDate(this.nextDate.getDate() + 7);
    this.dateRangeValue = [new Date(), this.nextDate];
    this.saleData = new DamageFilterModel();
    this.saleData.damage_date = [new Date(), this.nextDate];

    this.sub = this.route.paramMap.subscribe(val => {
      this.reset();
    });
  }

  ngOnInit() {
    this.getCompanyList();
  }
  ngAfterViewInit() {
    // this._dateRange();
  }
  getCompanyList() {
    this.homeService.getCompaniesByInventory().subscribe((res) => {
      this.companySearchData = res;
      for (let s of res) {
        this.companyList.push(s.name);
      }
    });
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
    for (let d of this.saleData.damage_date) {
      dateRange.push(this.datePipe.transform(new Date(d), "yyyy-MM-dd"));
    }
    this.saleData.damage_date = dateRange;
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
    this.saleData = new DamageFilterModel();
    this.saleData.date_start = null;
    this.saleData.date_end = null;
  }
  searchSaleData() {
    if (this.saleData.damage_date) {
      this.dateFormate();
    }
    if (this.saleData.company) {
      this.getCompanyId();
    }
    this.filter = FORMAT_SEARCH(this.saleData);
    if (this.filter) {
      this.loadList.emit(this.filter);
      this.search = true;
    }
  }
  company_search = (company$: Observable<string>) =>
    company$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.companyList.filter(name => name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  resetSearch() {
    this.reset();
    this.filter = null;
    if (this.search) {
      this.loadList.emit("");
      this.search = false;
    }
  }
}
