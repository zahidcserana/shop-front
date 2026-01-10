import { Component, OnInit } from "@angular/core";
import { MasterReportService } from "../master-report.service";
import {
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
} from "rxjs/operators";
import { of, Observable } from "rxjs";
import { DatePipe } from "@angular/common";
import * as $ from "jquery";
import Swal from "sweetalert2";
import { AppConfigService } from "src/app/services/app-config.service";

@Component({
  selector: "app-master-purchase-report",
  templateUrl: "./master-purchase-report.component.html",
  styleUrls: ["./master-purchase-report.component.css"],
})
export class MasterPurchaseReportComponent implements OnInit {
  currency = '৳';
  
  constructor(
    private MasterReportService: MasterReportService,
    private datePipe: DatePipe,
    public config: AppConfigService
  ) {}

  ngOnInit() {
    this.getPurcheseList();
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
  medicineList = [];

  searchData: any[] = [];
  medicineSearch: any = {
    search: "",
  };

  filterItem: any = {
    company: "",
    invoice: "",
    sales_man: 0,
    product: "",
    medicine_id: "",
    purchase_date: "",
    start_date: "",
    end_date: "",
  };

  summary: any = {
    total_amount: 0,
    total_discount: 0,
    total_due: 0,
    total_invoice: 0,
    total_medicine: 0,
    dateRangeData: "00-00-0000",
  };

  customLoader = true;
  showEmptyTable = true;

  getPurcheseList() {
    this.customLoader = true;
    this.MasterReportService.getPurcheseList()
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          this.loader = false;
          return of([]);
        })
      )
      .subscribe((response) => {
        this.loader = false;
        this.customLoader = false;
        this.purchaseList = response.data;
        this.summary.dateRangeData = response.summary.dateRangeData;
        if (!this.purchaseList.length) {
          this.showEmptyTable = true;
        } else {
          this.showEmptyTable = false;
        }
        this.claculateSummary(this.purchaseList);
      });
  }

  claculateSummary(data) {
    var sub_total = 0;
    var sub_discount = 0;
    var sub_due = 0;
    var total_number_of_medicine = 0;

    data.forEach((item, index) => {
      sub_total = sub_total + Number(item.total_amount);
      sub_discount = sub_discount + Number(item.discount);
      sub_due = sub_due + Number(item.total_due_amount);

      let item_list = item.items;
      item_list.forEach((product, index) => {
        total_number_of_medicine =
          total_number_of_medicine + Number(product.quantity);
      });
    });

    this.summary.total_amount = sub_total;
    this.summary.total_discount = sub_discount;
    this.summary.total_due = sub_due;
    this.summary.total_invoice = data.length;
    this.summary.total_medicine = total_number_of_medicine;
  }

  filterPurcheseList() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success modal-button purchase-confirm',
        cancelButton: 'btn btn-danger modal-button'
      },
      buttonsStyling: false
    });

    if (this.filterItem.purchase_date !== '') {
      let dateRange = [];
      for (let d of this.filterItem.purchase_date) {
        dateRange.push(this.datePipe.transform(new Date(d), "yyyy-MM-dd"));
      }

      for (let medicine of this.searchData) {
        if (medicine.name == this.filterItem.product) {
          this.filterItem.medicine_id = medicine.id;
        }
      }

      this.filterItem.purchase_date = dateRange;

      if (this.filterItem.purchase_date.length) {
        this.filterItem.start_date = this.filterItem.purchase_date[0];
        this.filterItem.end_date = this.filterItem.purchase_date[1];
      }

      this.customLoader = true;
      // $("#filter-medicine-btn").attr("disabled", true);
      if (
        this.filterItem.purchase_date.length ||
        this.filterItem.invoice ||
        this.filterItem.company ||
        this.filterItem.product ||
        this.filterItem.sales_man
      ) {
        let allParams = {
          details: this.filterItem,
        };

        this.MasterReportService.searchPurcheseList(allParams)
          .then((response) => {
            this.loader = false;
            this.purchaseList = response.data;
            this.summary.dateRangeData = response.summary.dateRangeData;
            this.customLoader = false;
            if (!this.purchaseList.length) {
              this.showEmptyTable = true;
            } else {
              this.showEmptyTable = false;
            }
            $("#filter-medicine-btn").attr("disabled", false);
            this.claculateSummary(this.purchaseList);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      swalWithBootstrapButtons.fire(
        'Please select date first',
        'Opps..!',
        'warning'
      );
    }
  }

  getCompanyList() {
    this.MasterReportService.getCompanyList()
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          this.loader = false;
          return of([]);
        })
      )
      .subscribe((response) => {
        this.loader = false;
        this.companyList = response;
      });
  }

  getSalesPersonsList() {
    this.MasterReportService.getSalesPersonsList()
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          this.loader = false;
          return of([]);
        })
      )
      .subscribe((response) => {
        this.loader = false;
        //console.log(response.data);
        this.salesPersonList = response.data;
      });
  }

  getSize(product) {
    return product.length;
  }

  company_search = (company$: Observable<string>) =>
    company$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.companyList
              .filter(
                (name) => name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchData = [];
        this.loader_sub = true;
      }),
      switchMap((term) => {
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
      this.loader_sub = false;
      return [];
    }

    return this.MasterReportService.searchMedicineByPharmacy(params).pipe(
      map((res) => {
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

  resetList() {
    $("#filter-medicine-btn").attr("disabled", false);
    this.getPurcheseList();
    this.filterItem = {
      company: "",
      invoice: "",
      sales_man: 0,
      product: "",
      medicine_id: "",
      purchase_date: "",
      start_date: "",
      end_date: "",
    };
  }
}
