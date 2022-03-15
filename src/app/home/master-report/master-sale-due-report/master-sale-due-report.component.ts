import { Component, OnInit } from '@angular/core';
import { MasterReportService } from '../master-report.service';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FORMAT_SEARCH } from 'src/app/common/_classes/functions';
import { SaleReportFilter } from '../../models/sale.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-master-sale-due-report',
  templateUrl: './master-sale-due-report.component.html',
  styleUrls: ['./master-sale-due-report.component.css']
})
export class MasterSaleDueReportComponent implements OnInit {
  search: boolean;
  summary: any;

  constructor(
    private MasterReportService: MasterReportService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    ) {
      this.nextDate.setDate(this.nextDate.getDate() + 7);
      this.dateRangeValue = [new Date(), this.nextDate];
      this.filterItem = new SaleReportFilter();
      this.filterItem.sale_date = [new Date(), this.nextDate];
      console.log('sale date');
      console.log(this.filterItem);
      this.sub = this.route.paramMap.subscribe(val => {
        this.reset();
      });
    }

  ngOnInit() {
    this.getDueList();
  }

  loader: boolean;
  loader_sub: boolean;
  sub: Subscription;
  dueList = [];

  // filterItem: any =
  // {
  //   invoice: "",
  //   status: 0,
  //   customer_name: "",
  //   customer_mobile: "",
  //   sale_date: "",
  //   start_date: "",
  //   end_date: "",
  // }
  filterItem: SaleReportFilter;
  dateRangeValue: Date[];
  nextDate = new Date();
  filter: string;

  customLoader = true;
  showEmptyTable = false;

  filterList() {
    if (this.filterItem.sale_date) {
      this.dateFormate();
    }
    this.filter = FORMAT_SEARCH(this.filterItem);
    if (this.filter) {
      this.getDueList();
      this.search = true;
    }
  }
  reset() {
    this.filterItem = new SaleReportFilter();
    this.filter = null;
    this.getDueList();
  }
  dateFormate() {
    let dateRange = [];
    for (let d of this.filterItem.sale_date) {
      dateRange.push(this.datePipe.transform(new Date(d), "yyyy-MM-dd"));
    }
    this.filterItem.sale_date = dateRange;
  }
  getDueList(){
    let data = null;
    this.customLoader = true;
    this.MasterReportService.searchDueList(this.filter).pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.customLoader = false;
      this.dueList = response.data;
      if(!this.dueList.length){
        this.showEmptyTable = true;
      }else{
        this.showEmptyTable = false;
      }
      this.summary = response.summary;
    });
  }

}
