import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { EmiService } from './emi.service';
import { EmiInstallment, EmiInstallmentSummary } from './emi.model';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale-emi',
  templateUrl: './sale-emi.component.html',
  styleUrls: ['./sale-emi.component.css']
})
export class SaleEmiComponent implements OnInit {

  selectedMonth: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  currency = '৳';

  emis: EmiInstallment[] = [];
  summary: EmiInstallmentSummary;

  /** 🔹 customer search */
  customerInput$ = new Subject<string>();
  customers$: Observable<any[]>;

  pageNo = 1;
  limit = 20;
  totalPages = 0;

  filters = {
    month: '',
    status: '',
    customer_id: ''
  };

  customLoader = false;

  selectedEmi: EmiInstallment | null = null;
  payAmount = 0;

  constructor(private emiService: EmiService) {}

  ngOnInit() {

    /** ✅ async customer search */
    this.customers$ = this.customerInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.emiService.searchCustomer(term))
    );

    /** datepicker config */
    this.bsConfig = {
      dateInputFormat: 'YYYY-MM',
      minMode: 'month',
      showWeekNumbers: false,
      containerClass: 'theme-default'
    };

    this.loadCurrentMonth();
  }

  loadCurrentMonth() {
    const today = new Date();
    this.filters.month = today.toISOString().slice(0, 7);
    this.loadData();
  }

  loadData() {
    this.pageNo = this.pageNo || 1;
    const params = {
      ...this.filters,
      page_no: this.pageNo,
      limit: this.limit
    };

    this.customLoader = true;

    this.emiService.getEmiInstallments(params).subscribe(res => {
      this.emis = res.data;
      this.summary = res.summary;
      this.totalPages = res.pagination.total_pages;
      this.customLoader = false;
    });
  }

  onMonthChange(date: Date | null) {
    if (!date) {
      this.filters.month = null;
      return;
    }

    this.pageNo = 1;

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    this.filters.month = `${year}-${month}`;
  }

  clearMonth() {
    this.selectedMonth = null;
    this.filters.month = null;
  }

  trackList(index, row) {
    return row ? row.id : null;
  }

  reset() {
    this.selectedMonth = null;

    this.filters = {
      month: null,
      status: '',
      customer_id: null
    };

    this.loadCurrentMonth();
  }

  openPayModal(item: EmiInstallment) {
    this.selectedEmi = item;
    this.payAmount = item.amount - item.paid_amount;
    this.submitPayment()
  }

  confirmPayment() {
    if (!this.selectedEmi) return;

    this.emiService.payInstallment(this.selectedEmi.id, {
      paid_amount: this.payAmount,
      paid_date: new Date()
    }).subscribe(() => {
      Swal.fire('Success', 'Installment paid successfully', 'success');
      this.loadData();
      this.selectedEmi = null;
    });
  }

  submitPayment() {
    if (!this.selectedEmi) return;

    const remaining = this.selectedEmi.amount - this.selectedEmi.paid_amount;

    Swal.fire({
      title: 'Confirm Payment',
      html: `
        <b>Customer:</b> ${this.selectedEmi.customer.name}<br>
        <b>Installment No:</b> ${this.selectedEmi.installment_no}<br>
        <b>Pay Amount:</b> ${this.payAmount}<br>
        <b>Remaining:</b> ${remaining}
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, Pay',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#28a745'
    }).then((result) => {
      if (result.value) {
        this.confirmPayment();
      }
    });
  }

  prevPage() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.loadData();
    }
  }

  nextPage() {
    if (this.pageNo < this.totalPages) {
      this.pageNo++;
      this.loadData();
    }
  }

}
