import { HomeService } from './../services/home.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { PurchaseService } from "./services/purchase.service";
import * as $ from "jquery";
import Swal from 'sweetalert2';
import { dateFormat } from 'highcharts';

import { ToastrService } from 'ngx-toastr';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ShortcutInput, ShortcutEventOutput } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  constructor(private PurchaseService: PurchaseService, private homeService: HomeService, private toastr: ToastrService) { }

  ngOnInit() {
    this.homeService.navigationTo();
    var local_item = JSON.parse(localStorage.getItem('purchaseItems'));
    if(local_item){
      this.allPurchaseItems = local_item;
      var grand_total = 0;
      this.allPurchaseItems.forEach((item, index) => {
        grand_total = grand_total + Number(item.amount);
      });
      this.purchaseDetails.total = grand_total;
      this.purchaseDetails.net_amount = grand_total;
      this.purchaseDetails.advance = grand_total;
    }
    this.getCompanyList();
    this.medicineName.nativeElement.focus();
  }

  searchList: any[];
  medicineList = [];
  allPurchaseItems = [];
  companyList: any[] = [];

  loader: boolean;
  searchData: any[] = [];
  loader_sub: boolean;
  medicineSearch: any = {
    search: ""
  };

  UnitVal = false;

  purchaseItem: any = {
    medicine: "",
    medicine_id: "",
    quantity: "",
    batch_no: "",
    exp_date: "",
    piece_per_box: "",
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

  purchaseDetails: any = {
    total: "",
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

  gotoBatchNo() {
    this.getMedicinePreviousPurchaseDetails();
    this.batchNo.nativeElement.focus();
  }
  gotoExpDate() {
    this.getMedicinePreviousPurchaseDetails();
    this.expDate.nativeElement.focus();
  }
  gotoPiecePerBox() {
    let date = this.purchaseItem.exp_date;
    if(date){
      var regex=new RegExp("^\\d{2}/\\d{4}$");
      var dateOk=regex.test(date);
      if(dateOk){
          $('#expDate').removeClass("exp-input-focus");
          this.piecePerBox.nativeElement.focus();
      }else{
        $('#expDate').addClass("exp-input-focus");
      }
    }else
    {
      this.piecePerBox.nativeElement.focus();
    }
    
  }
  gotoBoxTradePrice() {
    this.boxTradePrice.nativeElement.focus();
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

    return this.PurchaseService.searchMedicine(params).pipe(
      map(res => {
        this.medicineList = [];
        this.loader_sub = false;
        this.searchData = res;

        if(this.searchData.length === 1){
          for (let medicine of res) {
            this.medicineList.push(medicine.name);
            this.purchaseItem.medicine = medicine.name;
            this.purchaseItem.medicine_id = medicine.id;
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

  getMedicinePreviousPurchaseDetails() {
    let search_medicine_id = 0;
    for (let medicine of this.searchData) {
      if (medicine.name == this.purchaseItem.medicine) {
        search_medicine_id = medicine.id;
      }
    }
    if (search_medicine_id) {
      let data = { 'medicine_id' : search_medicine_id };
      this.PurchaseService.getPreviousPurchasedetails(data)
        .then(details => {
          // const details = response.data;
          this.purchaseItem.piece_per_box = details.pieces_per_box;
          this.purchaseItem.box_trade_price = details.trade_price;
          this.purchaseItem.box_vat = details.box_vat;
          this.purchaseItem.box_mrp = details.mrp;
          this.purchaseItem.low_stock_qty = details.low_stock_qty;
          this.purchaseItem.bar_code = details.barcode;
          this.purchaseItem.percentage = details.percentage;
          this.purchaseItem.quantity = '';
        })
        .catch(err => {
          console.log(err);
        });
      this.UnitVal = false;
      this.purchaseItem.update_price = true;
      // this.toastr.success('Box price taken!');
    }
    this.gotoBoxTradePrice();
  }

  getMedicineUnitPriceDetails(){
    console.log('shadow');
    let search_medicine_id = 0;
    for (let medicine of this.searchData) {
      if (medicine.name == this.purchaseItem.medicine) {
        search_medicine_id = medicine.id;
      }
    }

    if(search_medicine_id){
      let data = { 'medicine_id' : search_medicine_id }
      this.PurchaseService.getUnitPriceDetails(data)
        .then(response => {
          let details = response.data;
          if(details.pieces_per_box || details.trade_price || details.mrp){

            this.UnitVal = true;

            let piece_per_box = details.pieces_per_box;
            let box_trade_price = details.trade_price;
            let box_vat = details.box_vat;
            let box_mrp = details.mrp;
      
            let unit_tp = 0; let unit_vat = 0; let unit_mrp = 0;
      
            if(box_trade_price){
              unit_tp = Number(box_trade_price)/Number(piece_per_box);
            }
      
            if(box_vat){
              unit_vat = Number(box_vat)/Number(piece_per_box);
            }
      
            if(box_mrp){
              unit_mrp = Number(box_mrp)/Number(piece_per_box);
            }
      
            this.purchaseItem.piece_per_box = 1;
            this.purchaseItem.box_trade_price = unit_tp.toFixed(2);
            this.purchaseItem.box_vat = unit_vat.toFixed(2);
            this.purchaseItem.box_mrp = unit_mrp.toFixed(2);
            this.purchaseItem.bar_code = details.barcode;
            this.purchaseItem.update_price = false;
            this.purchaseItem.low_stock_qty = details.low_stock_qty;
            this.toastr.warning('Single unit price taken!');
            this.quantity.nativeElement.focus();
          }else{
            this.purchaseItem.piece_per_box = '';
            this.purchaseItem.box_trade_price = '';
            this.purchaseItem.box_vat = '';
            this.purchaseItem.box_mrp = '';
            this.purchaseItem.low_stock_qty = '';
            this.purchaseItem.bar_code = '';
            this.UnitVal = false;
            this.purchaseItem.update_price = true;
            // this.toastr.success('Box price taken!');
          }
        })
        .catch(err => {
          console.log(err)
        });
    }else{
      this.toastr.warning('Please, Select Correct Medicine!');
      this.medicineName.nativeElement.focus();
    }
  }

  shortcuts: ShortcutInput[] = [];
  ngAfterViewInit() {
    this.shortcuts.push(
      {
        key: ["Shift + w"],
        label: "Help",
        description: "Product Unit Price",
        command: (output: ShortcutEventOutput) =>
          this.getMedicineUnitPriceDetails()
      }
    );
  }

  getCompanyList(){
    this.PurchaseService.getCompanyList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.companyList = response;
    });
  }

  resetAllItem(){
    this.purchaseDetails = {
      total: "",
      vat: "",
      vat_percentage: "fixed",
      discount: "",
      net_amount: 0,
      advance: "",
      due: "",
      invoice: "",
      company: ""
    };
    this.purchaseItem = {
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

  pickValue(item){
    if(!this.purchaseItem.medicine){
      this.toastr.warning('Please, Select Medicine frist!');
      this.medicineName.nativeElement.focus();
    }else{
      if(this.purchaseItem.medicine === item.medicine){

        this.UnitVal = true;

        let piece_per_box = item.piece_per_box;
        let box_trade_price = item.box_trade_price;
        let box_vat = item.box_vat;
        let box_mrp = item.box_mrp;
  
        let unit_tp = 0; let unit_vat = 0; let unit_mrp = 0;
  
        if(box_trade_price){
          unit_tp = Number(box_trade_price)/Number(piece_per_box);
        }
  
        if(box_vat){
          unit_vat = Number(box_vat)/Number(piece_per_box);
        }
  
        if(box_mrp){
          unit_mrp = Number(box_mrp)/Number(piece_per_box);
        }
  
        this.purchaseItem.piece_per_box = 1;
        this.purchaseItem.box_trade_price = unit_tp.toFixed(2);
        this.purchaseItem.box_vat = unit_vat.toFixed(2);
        this.purchaseItem.box_mrp = unit_mrp.toFixed(2);
        this.purchaseItem.bar_code = item.bar_code;
        this.purchaseItem.update_price = false;
        this.toastr.error('Single unit price taken!');
      }else{
        this.toastr.error('Please, Select Correct Medicine!');
      }
      
    }
  }

  submitPurchaseDetails() {
    this.allPurchaseItems.reverse();
    const allParams = {
      details : this.purchaseDetails,
      items : this.allPurchaseItems
    };

    // $("#submitButtonForSave").attr("disabled", true);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success modal-button purchase-confirm',
        cancelButton: 'btn btn-danger modal-button'
      },
      buttonsStyling: false
    });

    if (!this.allPurchaseItems.length) {
      swalWithBootstrapButtons.fire(
        'Please add items!',
        'Opps..!',
        'warning'
      );
    } else {
      if (this.purchaseDetails.company === '') {
        swalWithBootstrapButtons.fire(
          'Please select supplier!',
          'Opps..!',
          'warning'
        );
      } else {
        $(".purchase-confirm").focus();
        swalWithBootstrapButtons.fire({
          title: 'Do you want submit details?',
          text: "Please check all the details!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          reverseButtons: true
        }).then((result) => {

          if (result.value) {

            this.PurchaseService.submitItem(allParams)
            .then(response => {

              localStorage.removeItem("purchaseItems");
              $("#typeahead-basic").focus();
              this.resetAllItem();
              this.allPurchaseItems = [];

              swalWithBootstrapButtons.fire(
                'Purchase details submitted successful!',
                'Successful!',
                'success'
              );
              $("#submitButtonForSave").attr("disabled", false);
              this.medicineName.nativeElement.focus();
            })
            .catch(err => {
              swalWithBootstrapButtons.fire(
                'Opps...',
                err.error.message,
                'error'
              );
              this.medicineName.nativeElement.focus();
              $("#submitButtonForSave").attr("disabled", false);
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.allPurchaseItems.reverse();
            swalWithBootstrapButtons.fire(
              'Cancelled',
              '',
              'error'
            );
            this.medicineName.nativeElement.focus();
            $("#submitButtonForSave").attr("disabled", false);
          }
        });
      }
    }
  }

  calculateVat(){
    var grand_total = this.purchaseDetails.total;
    //var vat = this.purchaseDetails.vat;
    var discount = this.purchaseDetails.discount;

    if(discount){
      if(Number(discount) >= Number(grand_total)){
        this.purchaseDetails.net_amount = Number(grand_total);
        this.purchaseDetails.advance = this.purchaseDetails.net_amount;
        this.purchaseDetails.discount = 0;
      }else{
        if(Number(discount) < 0){
          this.purchaseDetails.discount = 0;
        }else{
          this.purchaseDetails.net_amount = Number(grand_total) - Number(discount);
          this.purchaseDetails.advance = this.purchaseDetails.net_amount;
        }
      }

    }else{
      this.purchaseDetails.net_amount = grand_total;
      this.purchaseDetails.advance = grand_total;
    }
    this.purchaseDetails.due = 0;
    this.vatAmountInPercentage = 0;

    // if(vat){
    //   if(this.purchaseDetails.vat_percentage === "fixed")
    //   {
    //     var net_amount = Number(grand_total) + Number(this.purchaseDetails.vat);

    //     if(discount){
    //       if(Number(discount) >= Number(grand_total)){
    //         this.purchaseDetails.net_amount = Number(net_amount);
    //         this.purchaseDetails.advance = this.purchaseDetails.net_amount;
    //         this.purchaseDetails.discount = 0;
    //       }else{
    //         if(Number(discount) < 0){
    //           this.purchaseDetails.discount = 0;
    //         }else{
    //           this.purchaseDetails.net_amount = Number(net_amount) - Number(discount);
    //           this.purchaseDetails.advance = this.purchaseDetails.net_amount;
    //         }
    //       }
    //     }else{
    //       this.purchaseDetails.net_amount = net_amount;
    //       this.purchaseDetails.advance = net_amount;
    //     }
    //     this.purchaseDetails.due = 0;
    //     this.vatAmountInPercentage = 0;
    //   }else
    //   {
    //     var calculatedVat = (Number(grand_total) * Number(vat)) / 100;
    //     var net_amount = Number(grand_total) + Number(calculatedVat);

    //     this.vatAmountInPercentage = calculatedVat;

    //     if(discount){
    //       if(Number(discount) >= Number(grand_total)){
    //         this.purchaseDetails.net_amount = Number(net_amount);
    //         this.purchaseDetails.advance = this.purchaseDetails.net_amount;
    //         this.purchaseDetails.discount = 0;
    //       }else{
    //         if(Number(discount) < 0){
    //           this.purchaseDetails.discount = 0;
    //         }else{
    //           this.purchaseDetails.net_amount = Number(net_amount) - Number(discount);
    //           this.purchaseDetails.advance = this.purchaseDetails.net_amount;
    //         }
    //       }
    //     }else{
    //       this.purchaseDetails.net_amount = net_amount;
    //       this.purchaseDetails.advance = net_amount;
    //     }
    //     this.purchaseDetails.due = 0;
    //   }
    // }else
    // {
    //   if(discount){
    //     if(Number(discount) >= Number(grand_total)){
    //       this.purchaseDetails.net_amount = Number(net_amount);
    //       this.purchaseDetails.advance = this.purchaseDetails.net_amount;
    //       this.purchaseDetails.discount = 0;
    //     }else{
    //       if(Number(discount) < 0){
    //         this.purchaseDetails.discount = 0;
    //       }else{
    //         this.purchaseDetails.net_amount = Number(grand_total) - Number(discount);
    //         this.purchaseDetails.advance = this.purchaseDetails.net_amount;
    //       }
    //     }

    //   }else{
    //     this.purchaseDetails.net_amount = grand_total;
    //     this.purchaseDetails.advance = grand_total;
    //   }
    //   this.purchaseDetails.due = 0;
    //   this.vatAmountInPercentage = 0;
    // }
  }

  claculateDue(){
    if(Number(this.purchaseDetails.net_amount) < Number(this.purchaseDetails.advance)){
      this.purchaseDetails.due = 0;
      this.purchaseDetails.advance = this.purchaseDetails.net_amount;
    }else{
      this.purchaseDetails.due = Number(this.purchaseDetails.net_amount) - Number(this.purchaseDetails.advance);
    }
  }

  addMedicine()
  {
    if (this.purchaseItem.medicine && this.purchaseItem.quantity && this.purchaseItem.box_mrp && this.purchaseItem.box_trade_price) {
      let exist = false;
      for (let medicine of this.searchData) {
        if (medicine.name == this.purchaseItem.medicine) {
          this.purchaseItem.medicine_id = medicine.id;
          exist = true;
        }
      }
      if (exist) {
        this.purchaseItem.amount = Number(this.purchaseItem.quantity) * (Number(this.purchaseItem.box_trade_price) + Number(this.purchaseItem.box_vat));
        
        // let date = this.purchaseItem.exp_date;
        // if(date){
        //   let new_date = '25/' + date;
        //   this.purchaseItem.exp_date = new_date;
        // }
        console.log('data');
        console.log(this.purchaseItem);
        localStorage.removeItem("purchaseItems");
        this.allPurchaseItems.unshift(this.purchaseItem);
  
        var grand_total = 0;
        let total_vat = 0;
        this.allPurchaseItems.forEach((item, index) => {
          grand_total = grand_total + Number(item.amount);
          total_vat = total_vat + Number(item.box_vat);
        });
        this.purchaseDetails.total = grand_total;
        this.purchaseDetails.net_amount = grand_total;
        this.purchaseDetails.vat = total_vat;
        this.purchaseDetails.discount = '';
        this.purchaseDetails.advance = grand_total;
        this.purchaseDetails.due = 0;
        //this.allPurchaseItems.reverse();
        localStorage.setItem('purchaseItems', JSON.stringify(this.allPurchaseItems));
  
        this.purchaseItem = {
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

  deleteRow(row){
    this.allPurchaseItems.splice(row, 1);
    localStorage.removeItem("purchaseItems");
    //this.allPurchaseItems.reverse();
    localStorage.setItem('purchaseItems', JSON.stringify(this.allPurchaseItems));
    var grand_total = 0;
    this.allPurchaseItems.forEach((item, index) => {
      grand_total = grand_total + Number(item.amount);
    });
    this.purchaseDetails.total = grand_total;
    this.purchaseDetails.net_amount = grand_total;
    this.purchaseDetails.vat = 0;
    this.purchaseDetails.discount = '';
    this.purchaseDetails.advance = grand_total;
    this.purchaseDetails.due = 0;
    $("#typeahead-basic").focus();
  }

  calculateTPVAT(){
    const MRP = Number(this.purchaseItem.box_mrp);
    const TP = Number(this.purchaseItem.box_trade_price);
    const percentage = ((MRP - TP) / TP) * 100;
    // let TP = MRP - ((MRP * 25)/100);
    // let VAT = ((TP * 17.4)/100);

    this.purchaseItem.box_trade_price = TP.toFixed(2);
    this.purchaseItem.percentage = percentage.toFixed(2);
  }

  validateDate(){
    let date = this.purchaseItem.exp_date;
    if(date.length <= 2){
      var text = date.substring(0, 2);
      if(Number(text) > 12){
        if(Number(date.substring(1, 2)) == 0 ){
          text = '01';
        }else{
          text = '0' + date.substring(1, 2);
        }
      }
      if(date.length == 2){
        if(text.indexOf('/') > -1){
          
        }else{
          text = text + '/';
        }
      }
      $('#expDate').val(text);
    }
    if(date.length > 2){
      var next = date.substring(3, 12);
      if(next.length >= 4){
        if(Number(next) < 2019){
          $('#expDate').val(date.substring(0, 3));
        }
        if(Number(next) > 2099){
          $('#expDate').val(date.substring(0, 3));
        }
      }
    }
    var regex=new RegExp("^\\d{2}/\\d{4}$");
    var dateOk=regex.test(date);
    if(dateOk){
      if(Number(next) < 2099 && Number(next) >= 2019){
        $('#expDate').removeClass("exp-input-focus");
      }
    }else{
      $('#expDate').addClass("exp-input-focus");
    }
  }
}
