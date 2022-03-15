import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SaleModel } from '../../models/sale.model';
import { Pagi } from 'src/app/common/modules/pagination/pagi.model';
import { SaleService } from '../../services/sale.service';
import { HomeService } from '../../services/home.service';
import { ModalService } from 'src/app/common/_modal/modal.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-sale-report',
  templateUrl: './sale-report.component.html',
  styleUrls: ['./sale-report.component.css']
})
export class SaleReportComponent implements OnInit {

  dataList: SaleModel[] = [];
  pagi: Pagi = new Pagi();
  filter: string;
  orderDetails: any;
  returnItem = {
    sale_id: '',
    item_id: '',
    new_quantity: 0,
    unit_type: 'PCS',
  };
  sammary = {
    total_sale_amount: 0.00,
    total_due_amount: 0.00,
  }
  saleItem: any;
  constructor(
    private saleService: SaleService,
    private homeService: HomeService,
    private modalService: ModalService,
  ) {
    this.filter = this.filter ? this.filter : '';
    this.pagi.limit = this.pagi.limit ? this.pagi.limit : 500;
    this.pagi.page = this.pagi.page ? this.pagi.page : 1;
  }

  ngOnInit() {
    this.getSaleList(this.pagi.page, this.pagi.limit, this.filter);
  }
  getSaleList(p, l, q) {
    this.saleService.saleReport(p, l, q)
      .subscribe(res => {
        this.dataList = res.data;
        this.setData(res);
        this.sammary.total_sale_amount = res.total_sale_amount;
        this.sammary.total_due_amount = res.total_due_amount;
      });
    console.log(this.dataList);
  }
  reloadTable(e) {
    this.getSaleList(e.page, e.limit, e.filter);
  }
  trackList(index, pro) {
    return pro ? pro.id : null;
  }
  private setData(res) {
    this.pagi.total = res['total'] || 0;
    this.pagi.page = parseInt(res['page_no']) || 1;
    this.pagi.limit = parseInt(res['limit']) || 500;
  }
  openModal(saleId: number, modal: string) {
    $('#print-div').show();
    $('#close-div').show();
    this.getSaleDetails(saleId);
    this.modalService.open(modal);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
  printInvoice(printArea) {
    $('#print-div').hide();
    $('#close-div').hide();
    var divToPrint = document.getElementById(printArea);
    var strHead = "<html>\n<head>";
    strHead += "<style>.data-view-modal .clearfix:after{display:table;clear:both}.data-view-modal a{color:#5d6975;text-decoration:underline}.data-view-modal header{padding:0;margin-bottom:30px}.data-view-modal #logo{text-align:center;margin-bottom:10px}.data-view-modal #logo img{width:90px}.data-view-modal .pharmacy{color:#5d6975;font-size:1.6em;line-height:1.4em;font-weight:400;text-align:center;margin:0 0 20px}table.preview{width:100%;border-collapse:collapse;border-spacing:0;margin-bottom:20px;border:solid #dcdcdc 1px}table.preview tr:nth-child(2n-1) td{background:#f5f5f5}table.preview{text-align:center}table.preview th{padding:5px 20px;color:#5d6975;border-bottom:1px solid #c1ced9;white-space:nowrap;font-weight:400}table.preview th .sl .qty,table.preview tr > td .sl .qty{text-align:center}table.preview td{padding:5px}table.preview td.sl,table.preview td.qty,table.preview td.total{font-size:1.2em}.data-view-modal h1.pdf-div{border-top:1px solid #5d6975;border-bottom:1px solid #5d6975;color:#5d6975;font-size:0.9em;line-height:1.8em;font-weight:400;text-align:center;margin:0 0 20px;background:url(/assets/images/dimension.png)}.data-view-modal #print-div{margin-top:1%}.data-view-modal #print-button{width:7%;left:50%}.data-view-modal #close-button{width:7%;float:right}.data-view-modal div#customer-info,.data-view-modal div#pharmacy-info{flex:1}</style>";
    strHead += "\n <link rel=\"stylesheet\" type=\"text/css\"  href=\"/assets/css/bootstrap.min.css\">\n <link rel=\"stylesheet\" type=\"text/css\"  href=\"/css/agent_style.css\">\n <link rel=\"stylesheet\" type=\"text/css\"  href=\"/afcview/dist/css/AdminLTE.css\">\n<style>#invoice_modal_id{font-size: 10px;}#invoice_modal_id td{padding: 2px;}</style></head><body style=\"font-size: 10px;\"><div><center>\n"
      + divToPrint.innerHTML + "\n</center></div>\n</body>\n</html>";

    let newWin = window.open();
    // newWin.document.write(divToPrint.innerHTML);
    newWin.document.write(strHead);
    newWin.document.close();
    setTimeout(function () {
      newWin.print();
      newWin.close();
    }, 500);

    this.modalService.close(printArea);
  }
  getSaleDetails(saleId) {
    this.homeService.saleDetails(saleId)
      .subscribe((data) => this.orderDetails = data);
  }
  itemReturn(item) {
    this.returnItem.item_id = item.id;
    this.returnItem.sale_id = item.sale_id;
    this.returnItem.new_quantity = item.quantity;
    this.returnItem.unit_type = item.unit_type;
    this.saleItem = item;
  }
  submitReturn() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'confirm-button-class btn btn-success modal-button',
        cancelButton: 'cancel-button-class btn btn-danger modal-button',
      },
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.saleService.returnItem(this.returnItem).then(
          res => {
            this.getSaleDetails(this.returnItem.sale_id);
            this.saleItem = '';
          }
        );
      }
    });
  }
  removeItem(item) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        this.saleService.deleteItem(item.id).then(
          res => {
            this.getSaleDetails(item.sale_id);
          }
        );
      }
    });
  }
  /* Filter start*/
  filterList(e) {
    this.filter = e;
    this.getSaleList(1, 20, this.filter);
  }
  /* Filter end */
}
