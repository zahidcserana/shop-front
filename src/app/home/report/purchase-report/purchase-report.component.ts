import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { PurchaseReportService } from "./services/purchase-report.service";
import { ModalService } from 'src/app/common/_modal/modal.service';
import * as $ from "jquery";
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {

  constructor(
      private PurchaseReportService: PurchaseReportService,
      private modalService: ModalService,
      private datePipe: DatePipe,
    ) { }

    ngOnInit() {
      this.getPurcheseList();
    }

    loader: boolean;
    loader_sub: boolean;
    purchaseList = [];
    purchaseDetails: any;
    purchase: any;
    itemId;
    orderId;

    filterItem: any =
    {
      invoice: "",
      purchase_date: "",
      start_date: "",
      end_date: "",
    }

    getPurcheseList(){
      this.PurchaseReportService.getPurcheseList().pipe(map(response => {
        return response;
      }), catchError(err => {
        this.loader = false;
        return of([]);
      })).subscribe(response => {
        this.loader = false;
        this.purchaseList = response.data;
      });
    }

    openModal(orderId: number, modal: string) {
      $('#print-div').show();
      $('#close-div').show();
      this.getPurchaseDetails(orderId);
      this.modalService.open(modal);
      this.itemId = 0;
      this.orderId = 0;
    }

    closeModal(id: string) {
      this.modalService.close(id);
      this.purchaseDetails = [];
      this.purchase = [];
      this.itemId = 0;
      this.orderId = 0;
    }

    getPurchaseDetails(orderId){
      this.PurchaseReportService.getPurcheseDetails(orderId).subscribe((response) =>{
        this.purchaseDetails = response.data;
        this.purchase = response.purchase[0];
      });
    }

    filterList(){
      let dateRange = [];
      for (let d of this.filterItem.purchase_date) {
        dateRange.push(this.datePipe.transform(new Date(d), "yyyy-MM-dd"));
      }
      this.filterItem.purchase_date = dateRange;

      if(this.filterItem.purchase_date.length){
        this.filterItem.start_date = this.filterItem.purchase_date[0];
        this.filterItem.end_date = this.filterItem.purchase_date[1];
      }

      if(this.filterItem.purchase_date.length || this.filterItem.invoice){
        let allParams = {
          'details': this.filterItem,
        }
        this.PurchaseReportService.filterItemDetails(allParams)
          .then(response => {
            this.loader = false;
            this.purchaseList = response.data;
          })
          .catch(err => {
            console.log(err)
          });
      }
    }
    resetList(){
      this.getPurcheseList();
      this.filterItem = {
        invoice: "",
        purchase_date: "",
        start_date: "",
        end_date: "",
      }
    }
}
