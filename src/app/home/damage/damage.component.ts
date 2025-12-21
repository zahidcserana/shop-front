import { HomeService } from '../services/home.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { DamageService } from "./services/damage.service";
import * as $ from "jquery";
import Swal from 'sweetalert2';
import { dateFormat } from 'highcharts';

import { ToastrService } from 'ngx-toastr';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ShortcutInput, ShortcutEventOutput } from 'ng-keyboard-shortcuts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-damage',
  templateUrl: './damage.component.html',
  styleUrls: ['./damage.component.css']
})
export class DamageComponent implements OnInit {
  isSubmitting = false;
  showResetButton: boolean = false;
  currency = '৳';

  constructor(
    private DamageService: DamageService,
    private homeService: HomeService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkLocalStorage();
    this.homeService.navigationTo();
    var local_item = JSON.parse(localStorage.getItem('damageItems'));
    if(local_item){
      this.allDamageItems = local_item;
      var grand_total = 0;
      this.allDamageItems.forEach((item, index) => {
        grand_total += Number(item.amount);
      });

      grand_total = Math.round((grand_total + Number.EPSILON) * 100) / 100;

      this.damageDetails.total = grand_total;
      this.damageDetails.net_amount = grand_total;
      this.damageDetails.advance = grand_total;
    }
    this.getCompanyList();
    this.medicineName.nativeElement.focus();
  }

  searchList: any[];
  medicineList = [];
  allDamageItems = [];
  companyList: any[] = [];

  loader: boolean;
  searchData: any[] = [];
  loader_sub: boolean;
  medicineSearch: any = {
    search: ""
  };

  UnitVal = false;

  damageItem: any = {
    medicine: "",
    medicine_id: "",
    quantity: "",
    batch_no: "",
    exp_date: "",
    piece_per_box: 1,
    box_trade_price: "",
    box_vat: "",
    percentage: '',
    box_mrp: "",
    amount: "",
    remarks: "",
    low_stock_qty: "",
    bar_code: "",
    update_price: true
  };

  vatAmountInPercentage = 0;

  damageDetails: any = {
    total: 0,
    vat: "",
    vat_percentage: "fixed",
    discount: "",
    net_amount: 0,
    advance: "",
    due: "",
    invoice: "",
    company: '',
  };

  customLoader = true;
  showEmptyTable = false;

  @ViewChild("medicineName") medicineName: ElementRef;
  @ViewChild("batchNo") batchNo: ElementRef;
  @ViewChild("expDate") expDate: ElementRef;
  @ViewChild("piecePerBox") piecePerBox: ElementRef;
  @ViewChild("boxTradePrice") boxTradePrice: ElementRef;
  @ViewChild("boxVAT") boxVAT: ElementRef;
  @ViewChild("boxMrp") boxMrp: ElementRef;
  @ViewChild("quantity") quantity: ElementRef;
  @ViewChild("remarks") remarks: ElementRef;
  @ViewChild("barCode") barCode: ElementRef;
  @ViewChild("lowStockQty") lowStockQty: ElementRef;
  @ViewChild("supplier") supplier: ElementRef;
  @ViewChild("buttonPO") buttonPO: ElementRef;

  checkLocalStorage() {
    const items = JSON.parse(localStorage.getItem('damageItems'))
    this.showResetButton = !!(items && items.length > 0);
  }

  gotoBatchNo() {
    this.getMedicinePreviousDamageDetails();
    this.quantity.nativeElement.focus();
  }
  gotoBoxTradePrice() {
    this.quantity.nativeElement.focus();
  }
  gotoVAT(){
    this.boxVAT.nativeElement.focus();
  }
  gotoBoxMrp() {
    this.boxMrp.nativeElement.focus();
  }
  gotoQuantity() {
    this.quantity.nativeElement.focus();
  }
  gotoBarcode() {
    this.barCode.nativeElement.focus();
  }
  gotoRemarks() {
    this.lowStockQty.nativeElement.focus();
  }

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

  @ViewChild('typeaheadInstance')
  private typeaheadInstance: NgbTypeahead;

  typeaheadKeydown($event: KeyboardEvent) {
    if (this.typeaheadInstance.isPopupOpen()) {
      setTimeout(() => {
        const popup = document.getElementById(this.typeaheadInstance.popupId);
        const activeElements = popup.getElementsByClassName('active');
        if (activeElements.length === 1) {
          // activeElements[0].scrollIntoView();
          const elem = (activeElements[0] as any);
          if (typeof elem.scrollIntoViewIfNeeded === 'function') {
            // non standard function, but works (in chrome)...
            elem.scrollIntoViewIfNeeded();
          } else {
            //do custom scroll calculation or use jQuery Plugin or ...
            this.scrollIntoViewIfNeededPolyfill(elem as HTMLElement);
          }
        }
      });
    }
  }

  private scrollIntoViewIfNeededPolyfill(elem: HTMLElement, centerIfNeeded = true) {
    var parent = elem.parentElement,
        parentComputedStyle = window.getComputedStyle(parent, null),
        parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
        parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
        overTop = elem.offsetTop - parent.offsetTop < parent.scrollTop,
        overBottom = (elem.offsetTop - parent.offsetTop + elem.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
        overLeft = elem.offsetLeft - parent.offsetLeft < parent.scrollLeft,
        overRight = (elem.offsetLeft - parent.offsetLeft + elem.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
        alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop = elem.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + elem.clientHeight / 2;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft = elem.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + elem.clientWidth / 2;
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      elem.scrollIntoView(alignWithTop);
    }
  };

  getMedicineList(params): any {
    if (!params && params === "") {
      this.loader_sub = false;
      return [];
    }

    return this.DamageService.searchMedicine(params).pipe(
      map(res => {
        this.medicineList = [];
        this.loader_sub = false;
        this.searchData = res;

        if(this.searchData.length === 1){
          for (let medicine of res) {
            this.medicineList.push(medicine.name);
            this.damageItem.medicine = medicine.name;
            this.damageItem.medicine_id = medicine.id;
            this.batchNo.nativeElement.focus();
          }
        }else{
          for (let medicine of res) {
            this.medicineList.push(medicine.name);
          }
        }
        // for (let medicine of res) {
        //   this.medicineList.push(medicine.name);
        // }
        return this.medicineList;
      }),
      catchError(() => {
        this.loader_sub = false;
        return [];
      })
    );
  }

  getMedicinePreviousDamageDetails() {
    let search_medicine_id = 0;
    for (let medicine of this.searchData) {
      if (medicine.name == this.damageItem.medicine) {
        search_medicine_id = medicine.id;
      }
    }
    if (search_medicine_id) {
      let data = { 'medicine_id' : search_medicine_id };
      this.DamageService.getPreviousDamagedetails(data)
        .then(details => {
          // const details = response.data;
          this.damageItem.piece_per_box = details.pieces_per_box;
          this.damageItem.box_trade_price = details.trade_price;
          this.damageItem.box_vat = details.box_vat;
          this.damageItem.box_mrp = details.mrp;
          this.damageItem.low_stock_qty = details.low_stock_qty;
          this.damageItem.bar_code = details.barcode;
          this.damageItem.percentage = details.percentage;
          this.damageItem.quantity = '';
        })
        .catch(err => {
          console.log(err);
        });
      this.UnitVal = false;
      this.damageItem.update_price = true;
      // this.toastr.success('Box price taken!');
      this.gotoBoxTradePrice();
    } else {
      this.medicineName.nativeElement.focus()
    }
  }

  getCompanyList() {
    this.DamageService.getCompanyList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.companyList = response;
    });
  }

  confirmReset() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success modal-button',
        cancelButton: 'btn btn-danger modal-button'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'All current damage details will be cleared!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.reset();
        this.showResetButton = false;
      }
    });
  }

  reset() {
    localStorage.removeItem('damageItems');
    this.resetAllItem();
    this.allDamageItems = [];
    this.medicineName.nativeElement.focus();
  }

  resetAllItem() {
    this.damageDetails = {
      total: 0,
      vat: "",
      vat_percentage: "fixed",
      discount: "",
      net_amount: 0,
      advance: "",
      due: "",
      invoice: "",
      company: ""
    };
    this.damageItem = {
      medicine: "",
      medicine_id: "",
      quantity: "",
      batch_no: "",
      exp_date: "",
      piece_per_box: "",
      box_trade_price: "",
      box_vat: "",
      box_mrp: "",
      amount: "",
      remarks: "",
      low_stock_qty: "",
      bar_code: "",
      update_price: true,
    };
  }

  submitDamageDetails() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success modal-button damage-confirm',
        cancelButton: 'btn btn-danger modal-button'
      },
      buttonsStyling: false
    });

    // Validation: no items
    if (!this.allDamageItems.length) {
      swalWithBootstrapButtons.fire('Please add items!', 'Opps..!', 'warning');
      return;
    }

    const allParams = {
      items: [...this.allDamageItems].reverse() // safe copy
    };

    this.isSubmitting = true; // Angular property for disabling button

    swalWithBootstrapButtons.fire({
      title: 'Do you want to submit details?',
      text: 'Please check all the details!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.DamageService.submitItem(allParams)
          .then(response => {
            localStorage.removeItem('damageItems');
            this.resetAllItem();
            this.allDamageItems = [];

            Swal.fire({
              position: "center",
              type: "success",
              title: "Damage completed successfully.",
              showConfirmButton: false,
              timer: 1500
            });

            this.medicineName.nativeElement.focus();
          })
          .catch(err => {
            const message =
              err.error.message || 'Something went wrong. Please try again.';
            swalWithBootstrapButtons.fire('Opps...', message, 'error');
            this.medicineName.nativeElement.focus();
          })
          .finally(() => {
            this.isSubmitting = false;
            this.router.navigate(['/damage/list']);
          });
      } else {
        swalWithBootstrapButtons.fire('Cancelled', '', 'error');
        this.medicineName.nativeElement.focus();
        this.isSubmitting = false;
      }
    });
  }

  goSupplier() {
    this.supplier.nativeElement.focus();
  }
  goButtonPO() {
    this.buttonPO.nativeElement.focus();
  }

  addMedicine()
  {
    if (this.damageItem.medicine && this.damageItem.quantity) {
      let exist = false;
      for (let medicine of this.searchData) {
        if (medicine.name == this.damageItem.medicine) {
          this.damageItem.medicine_id = medicine.id;
          exist = true;
        }
      }
      if (exist) {
        this.damageItem.amount = Number(this.damageItem.quantity) * Number(this.damageItem.box_trade_price);
      
        let existDamageItem = this.allDamageItems.find(row => row.medicine_id === this.damageItem.medicine_id);

        if (existDamageItem) {
          existDamageItem.quantity = Number(existDamageItem.quantity) + Number(this.damageItem.quantity);
          existDamageItem.amount = Number(existDamageItem.quantity) * Number(existDamageItem.box_trade_price);
        } else {
          this.allDamageItems.unshift(this.damageItem);
        }
  
        var grand_total = 0;
        let total_vat = 0;

        this.allDamageItems.forEach((item, index) => {
          grand_total += Number(item.amount);
          total_vat += Number(item.box_vat);
        });

        grand_total = Math.round((grand_total + Number.EPSILON) * 100) / 100;

        this.damageDetails.total = grand_total;
        this.damageDetails.net_amount = grand_total;
        this.damageDetails.vat = total_vat;
        this.damageDetails.discount = '';
        this.damageDetails.advance = grand_total;
        this.damageDetails.due = 0;
        //this.allDamageItems.reverse();
        localStorage.setItem('damageItems', JSON.stringify(this.allDamageItems));
  
        this.damageItem = {
          medicine: "",
          medicine_id: "",
          quantity: 0,
          batch_no: "",
          exp_date: "",
          piece_per_box: 1,
          box_trade_price: "",
          box_vat: "",
          box_mrp: "",
          amount: "",
          remarks: "",
          low_stock_qty: "",
          bar_code: "",
          update_price: true,
        };
        this.UnitVal = false;
      }else{
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success modal-button',
            cancelButton: 'btn btn-danger modal-button'
          },
          buttonsStyling: false
        });
        swalWithBootstrapButtons.fire(
          'Opps...',
          'Product not found! Please check product details!',
          'error'
        );
      }
      $("#typeahead-basic").focus();
    }
    this.medicineName.nativeElement.focus();
  }

  deleteRow(row) {
    this.allDamageItems.splice(row, 1);
    localStorage.removeItem("damageItems");
    //this.allDamageItems.reverse();
    localStorage.setItem('damageItems', JSON.stringify(this.allDamageItems));
    var grand_total = 0;
    this.allDamageItems.forEach((item, index) => {
      grand_total = grand_total + Number(item.amount);
    });
    this.damageDetails.total = grand_total;
    this.damageDetails.net_amount = grand_total;
    this.damageDetails.vat = 0;
    this.damageDetails.discount = '';
    this.damageDetails.advance = grand_total;
    this.damageDetails.due = 0;
    $("#typeahead-basic").focus();
  }

}
