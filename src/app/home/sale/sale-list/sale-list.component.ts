import { SaleService } from './../../services/sale.service';
import { Component, OnInit } from '@angular/core';
import { SaleModel } from '../../models/sale.model';
import { Pagi } from 'src/app/common/modules/pagination/pagi.model';
import { HomeService } from '../../services/home.service';
import * as $ from 'jquery';
declare var require: any
import { ModalService } from 'src/app/common/_modal/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css']
})
export class SaleListComponent implements OnInit {
  profitShow = false;
  tpShow = false;
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
  priceInWord = '';
  adminData = {
    email: '',
    password: '',
  };
  percentage = false;
  discount_amount = 0;
  sammary = {
    total_sale_amount: 0.00,
    total_due_amount: 0.00,
  }
  saleItem: any;
  isAdmin = false;
  constructor(
    private saleService: SaleService,
    private homeService: HomeService,
    private modalService: ModalService,
  ) {
    this.filter = this.filter ? this.filter : '';
    this.pagi.limit = this.pagi.limit ? this.pagi.limit : 500;
    this.pagi.page = this.pagi.page ? this.pagi.page : 1;
  }

  customLoader = true;
  showEmptyTable = false;

  getDiscount() {
    if (!this.percentage) {
      $("#dicountValue").hide();
      this.discount_amount = this.orderDetails.discount;
    } else {
      this.discount_amount = (this.orderDetails.sub_total / 100) * this.orderDetails.discount;
      $("#dicountValue").show();
    }
  }
  getNet() {
    this.orderDetails.total_payble_amount = this.orderDetails.sub_total - this.discount_amount;
  }
  calculation() {
    this.getDiscount();
    this.getNet();
  }
  submit() {
    this.checkAdmin();
    if (this.isAdmin == true) {
      let data = {
        'id': this.orderDetails.order_id,
        'discount': this.discount_amount,
        'total_payble_amount': this.orderDetails.total_payble_amount
      };
      this.saleService.giveDiscount(data)
        .then(
          res => {
            Swal.fire({
              position: "center",
              type: "success",
              title: "Successfully submitted.",
              showConfirmButton: false,
              timer: 1500
            });
            this.getSaleList(this.pagi.page, this.pagi.limit, this.filter);
          });
    } else {
      this.checkAdmin();
    }
  }

  ngOnInit() {
    this.getSaleList(this.pagi.page, this.pagi.limit, this.filter);
    const user = JSON.parse(localStorage.getItem("currentUser"));
    this.profitShow = user.config.profit_show;
    this.tpShow = user.config.tp_show;
  }

  getPriceInWord(value) {
    var converter = require('number-to-words');
    this.priceInWord = converter.toWords(value);
    this.priceInWord += ' taka only';
  }

  getSaleList(p, l, q) {
    this.customLoader = true;
    this.saleService.getSaleList(p, l, q)
      .subscribe(res => {
        this.dataList = res.data;
        this.setData(res);
        this.sammary.total_sale_amount = res.total_sale_amount;
        this.sammary.total_due_amount = res.total_due_amount;
        this.customLoader = false;
      });
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
    //const user = JSON.parse(localStorage.getItem("currentUser"));
    // if (user.pos_version == 2) {
    //   modal = 'print-modal-pos-v2';
    // }
    this.percentage = false;
    this.discount_amount = 0;
    $("#dicountValue").hide();
    $('#print-div').show();
    $('#close-div').show();
    this.getSaleDetails(saleId);
    this.modalService.open(modal);
  }

  openModalPos(saleId: number, modal: string) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user.pos_version == 2) {
      modal = 'print-modal-pos-v2';
    }
    this.percentage = false;
    this.discount_amount = 0;
    $("#dicountValue").hide();
    $('#print-div').show();
    $('#close-div').show();
    this.getSaleDetails(saleId);
    this.modalService.open(modal);
  }

  closeModal(id: string) {
    this.saleItem = '';
    this.modalService.close(id);
  }

  printInvoice(printArea) {
    $('.print-div').hide();
    $('#print-div').hide();
    $('#close-div').hide();

    var divToPrint = document.getElementById(printArea);
    var strHead = "<html>\n<head><style>";
    strHead += "#invoice-POS{box-shadow:0 0 1in -.25in rgba(0,0,0,.5);padding:2mm;margin:0 auto;width:44mm;background:#fff}::selection{background:#f31544;color:#fff}::moz-selection{background:#f31544;color:#fff}h1{font-size:1.5em;color:#222}h2{font-size:.9em}h3{font-size:1.2em;font-weight:300;line-height:2em}p{font-size:.7em;color:#666;line-height:1.2em}#bot,#mid,#top{border-bottom:1px solid #eee}#top{min-height:100px}#mid{min-height:80px}#bot{min-height:50px}#top .logo{float:left;height:60px;width:60px;background:url(http://michaeltruong.ca/images/logo1.png) no-repeat;background-size:60px 60px}.clientlogo{float:left;height:60px;width:60px;background:url(http://michaeltruong.ca/images/client.jpg) no-repeat;background-size:60px 60px;border-radius:50px}.info{display:block;float:left;margin-left:0}.title{float:right}.title p{text-align:right}table{width:100%;border-collapse:collapse}td{padding:5px 0 5px 15px;border:1px solid #000}th{border:1px solid #000}.tabletitle{padding:5px;font-size:.5em;background:#eee}.service{border-bottom:1px solid #eee}.item{width:24mm}.itemtext{font-size:.5em}#legalcopy{margin-top:5mm}";
    strHead += "</style>\n <link rel=\"stylesheet\" type=\"text/css\"  href=\"/assets/css/bootstrap.min.css\">\n <link rel=\"stylesheet\" type=\"text/css\"  href=\"/css/agent_style.css\">\n <link rel=\"stylesheet\" type=\"text/css\"  href=\"/afcview/dist/css/AdminLTE.css\">\n<style>#invoice_modal_id{font-size: 10px;}#invoice_modal_id td{padding: 2px;}</style></head><body style=\"font-size: 10px;\"><div><center>\n"
      + divToPrint.innerHTML + "\n</center></div>\n</body>\n</html>";

    var w = window.open();
    $(w.document.body).html(strHead);
    w.print();
    window.location.reload();
  }
  printPosInvoice(printArea) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user.pos_version == 2) {
      printArea = 'pos-invoice-print-v2';
    }
    // this.modalService.close('print-modal-pos');
    var divToPrint = document.getElementById(printArea);
    var strHead = "<html>\n<head><style>@page { size: 0in; }</style><body style='font-size: 8px!important;text-align: center;'>";
    strHead += divToPrint.innerHTML + "\n</center></div>\n</body>\n</html>";

    var w = window.open();
    $(w.document.body).html(strHead);
    // w.menubar.visible = false;
    w.print();
    window.location.reload();
  }
  getSaleDetails(saleId) {
    this.homeService.saleDetails(saleId)
      .subscribe((data) => {
        this.orderDetails = data;
        this.getPriceInWord(this.orderDetails.total_payble_amount);
        console.log(data);
      });
  }
  itemReturn(item) {
    this.returnItem.item_id = item.id;
    this.returnItem.sale_id = item.sale_id;
    this.returnItem.new_quantity = item.quantity;
    this.returnItem.unit_type = item.unit_type;
    this.saleItem = item;
  }
  async adminStatus() {
    const { value: formValues } = await Swal.fire({
      title: 'Admin Email & Password',
      html:
        '<input id="swal-input1" class="swal2-input" Placeholder="Email">' +
        '<input id="swal-input2" class="swal2-input" Placeholder="Password">',
      focusConfirm: false,
      preConfirm: () => {
        this.adminData.email = $("#swal-input1").val();
        this.adminData.password = $("#swal-input2").val();
        return;
      }
    })

    if (formValues) {
      this.homeService.checkAdmin(this.adminData).then(res => {
        if (res.status === true) {
          this.isAdmin = true;
        } else {
          Swal.fire({
            type: "warning",
            title: "Oops...",
            text: "Wrong Email, Password.",
            showConfirmButton: false
          });
          setTimeout(() => { return true }, 1000);
        }
      })
    }
    return false;
  }

   checkAdmin() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user.user_type == 'ADMIN') {
      this.isAdmin = true;
      return true;
    }
    return this.adminStatus();
  }
  submitReturn() {
    if (this.checkAdmin) {
    this.saleService.returnItem(this.returnItem).then(
        res => {
          Swal.fire({
            position: "center",
            type: "success",
            title: "Item successfully updated.",
            showConfirmButton: false,
            timer: 1500
          });
          this.getSaleDetails(this.returnItem.sale_id);
          this.saleItem = '';
          this.getSaleList(this.pagi.page, this.pagi.limit, this.filter);
        }
      );
      // Swal.fire({
      //   title: 'Are you sure?',
      //   text: "You won't be able to revert this!",
      //   type: 'warning',
      //   showCancelButton: true,
      //   customClass: {
      //     confirmButton: 'confirm-button-class btn btn-success modal-button',
      //     cancelButton: 'cancel-button-class btn btn-danger modal-button',
      //   },
      //   confirmButtonColor: '#3085d6',
      //   cancelButtonColor: '#d33',
      //   confirmButtonText: 'Yes'
      // }).then((result) => {
      //   if (result.value) {
      //     this.saleService.returnItem(this.returnItem).then(
      //       res => {
      //         this.getSaleDetails(this.returnItem.sale_id);
      //         this.saleItem = '';
      //         this.getSaleList(this.pagi.page, this.pagi.limit, this.filter);
      //       }
      //     );
      //   }
      // });
    } else {
      Swal.fire({
        type: "warning",
        title: "Oops...",
        text: "Wrong Email, Password.",
        showConfirmButton: false
      });
    }
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
