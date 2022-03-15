import { Component, OnInit } from '@angular/core';
import { PurchaseDueService } from './services/purchase-due.service'
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import * as $ from "jquery";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-due',
  templateUrl: './purchase-due.component.html',
  styleUrls: ['./purchase-due.component.css']
})
export class PurchaseDueComponent implements OnInit {

  constructor(
    private PurchaseDueService: PurchaseDueService,
  ) { }

  ngOnInit() {
    this.getPurcheseList();
  }

  loader: boolean;
  loader_sub: boolean;
  purchaseList = [];
  purchaseDetails: any;
  purchase: any;
  orderId;

  dueDetails: any = {
    order_id: 0,
    total: "",
    discount: "",
    payble_due: "",
    payble_discount: "",
    pay_amount: '',
    vat: '',
    vat_type: '',
    total_vat: ''
  };

  getPurcheseList(){
    this.PurchaseDueService.getPurcheseList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.purchaseList = response.data;
    });
  }

  getPurchaseDetails(orderId){
    this.PurchaseDueService.getPurcheseDetails(orderId).subscribe((response) =>{ 
      if(response.data){
        this.orderId = response.purchase[0].order_id;
        this.dueDetails.order_id = response.purchase[0].order_id;
        this.dueDetails.total = response.purchase[0].total_amount;
        this.dueDetails.discount = response.purchase[0].discount;
        this.dueDetails.payble_due = response.purchase[0].total_due_amount;
        this.dueDetails.vat = response.purchase[0].vat;
        this.dueDetails.vat_type = response.purchase[0].vat_type;
        if(response.purchase[0].vat_type==='percentage'){
          this.dueDetails.total_vat = (response.purchase[0].total_amount*response.purchase[0].vat)/100;
        }else{
          this.dueDetails.total_vat = response.purchase[0].vat;
        }
      }
      this.purchaseDetails = response.data;
      this.purchase = response.purchase[0];
    });
  }

  submitDueDetails(){
    let allParams = {
      'details': this.dueDetails,
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success modal-button',
        cancelButton: 'btn btn-danger modal-button'
      },
      buttonsStyling: false
    });

    this.PurchaseDueService.submitDueItem(allParams)
    .then(response => {

      this.resetAllItem();
      this.getPurcheseList();
      this.getPurchaseDetails(this.orderId);

      swalWithBootstrapButtons.fire(
        'Due details submitted successful!',
        'Successful!',
        'success'
      );

    })
    .catch(err => {
      console.log(err)
    });
  }

  resetAllItem(){
    this.dueDetails = {
      order_id: 0,
      total: "",
      discount: "",
      payble_due: "",
      payble_discount: "",
      pay_amount: '',
      vat: '',
      vat_type: '',
      total_vat: ''
    };
  }

  backToList(){
    this.orderId = 0;
  }

}
