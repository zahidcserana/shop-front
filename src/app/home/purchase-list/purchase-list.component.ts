import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  map,
  catchError,
} from "rxjs/operators";
import { PurchaseListService } from "./services/purchase-list.service";
import { ModalService } from "src/app/common/_modal/modal.service";
import * as $ from "jquery";
import Swal from "sweetalert2";
import { HomeService } from "../services/home.service";
import { Pagi } from "src/app/common/modules/pagination/pagi.model";
import { ToastrService } from "ngx-toastr";
import { AppConfigService } from "src/app/services/app-config.service";

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css'],
})
export class PurchaseListComponent implements OnInit {
  pagi: Pagi = new Pagi();
  filter: string;
  currency = '৳';

  loader: boolean;
  loader_sub: boolean;
  purchaseList = [];
  purchaseDetails: any;
  purchase: any;
  itemId;
  orderId;

  updatePurchaseItem: any = {
    item_id: 0,
    order_id: 0,
    item_name: '',
    company: '',
    new_quantity: '',
  };

  adminData = {
    email: '',
    password: '',
  };
  isAdmin = false;

  customLoader = true;
  showEmptyTable = false;

  constructor(
    private purchaseListService: PurchaseListService,
    private homeService: HomeService,
    private modalService: ModalService,
    private toastr: ToastrService,
    public config: AppConfigService
  ) {
    this.pagi.limit = this.pagi.limit ? this.pagi.limit : 100;
    this.pagi.page = this.pagi.page ? this.pagi.page : 1;
  }

  ngOnInit() {
    this.getPurcheseList();
  }

  getPurcheseList() {
    this.getPurchaseList(this.pagi.page, this.pagi.limit, this.filter);
  }
  reloadTable(e) {
    this.getPurchaseList(e.page, e.limit, e.filter);
  }
  filterList(e) {
    this.filter = e;
    this.getPurchaseList(1, 500, this.filter);
  }
  private setData(res) {
    this.pagi.total = res["total"] || 0;
    this.pagi.page = parseInt(res["page_no"]) || 1;
    this.pagi.limit = parseInt(res["limit"]) || 500;
  }
  getPurchaseList(p, l, q) {
    this.customLoader = true;
    this.purchaseListService.getPurcheseList(p, l, q)
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
        this.purchaseList = response.data;
        this.customLoader = false;
        if (!response.total) {
          this.showEmptyTable = true;
        } else {
          this.showEmptyTable = false;
        }
        this.setData(response);
      });
  }

  openModal(orderId: number, modal: string) {
    console.log(this.orderId);
    $('.detail-' + this.orderId).removeClass('detail-order');
    $('.detail-' + orderId).addClass('detail-order');
    this.orderId = orderId;
    this.getPurchaseDetails(orderId, modal);
    console.log(this.orderId);

    // this.itemId = 0;
    // this.orderId = 0;
  }

  closeModal(id: string) {
    this.modalService.close(id);
    this.purchaseDetails = [];
    this.purchase = [];
    // this.itemId = 0;
    // this.orderId = 0;
  }

  getPurchaseDetails(orderId, modal) {
    this.purchaseListService.getPurcheseDetails(orderId).subscribe(
      (response) => {
        let itemlist = response.data;
        if (response.total) {
          this.toastr.error("All Products has been deleted from the list!!");
          this.closeModal("print-modal");
        } else {
          $("#print-div").show();
          $("#close-div").show();
          if (modal !== 0) {
            this.modalService.open(modal);
            this.purchaseDetails = response.data;
            this.purchase = response.purchase[0];
          }
        }
      }
    );
  }

  deletePurchaseDetails(orderId) {
    Swal.fire({
      title: "Are you sure?",
      text: 'You won"t be able to revert this!',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.deletePurchase(orderId);
      }
    });
  }

  deletePurchase(orderId) {
    const data = { purchase_id: orderId };

    this.purchaseListService.deletePurchaseDetails(data)
      .then((response) => {
        if (response.status) {
          Swal.fire(
            "Purchase details deleted successful!",
            "Successful!",
            "success"
          );
          this.getPurcheseList();
        } else {
          Swal.fire("Some Item already in list!", "Opps..!", "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(orderId);
  }

  resetItemDetails() {
    this.updatePurchaseItem = {
      item_id: 0,
      order_id: 0,
      item_name: '',
      company: '',
      new_quantity: '',
    };
  }

  changeItemDetails(item) {
    this.resetItemDetails();
    this.itemId = item.item_id;
    this.orderId = item.item_order_id;
    this.updatePurchaseItem.item_id = item.item_id;
    const itemName = item.medicine_type.substring(0, 3) + '. ' + item.medicine_name;
    this.updatePurchaseItem.order_id = item.item_order_id;
    this.updatePurchaseItem.item_name = itemName;
    // this.updatePurchaseItem.company = item.company_name;
    this.updatePurchaseItem.new_quantity = item.quantity;
  }

  updateItemDetails() {
    this.checkAdmin();
    if (this.isAdmin == true) {
      const allParams = {
        details: this.updatePurchaseItem,
      };

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success modal-button",
          cancelButton: "btn btn-danger modal-button",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Do you want submit details?",
          text: "Please check all the details!",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Submit",
          cancelButtonText: "Cancel",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            this.purchaseListService.submitItemDetails(allParams)
              .then((response) => {
                this.getPurchaseDetails(this.orderId, 'print-modal');
                this.getPurcheseList();

                swalWithBootstrapButtons.fire(
                  "Item details submitted successful!",
                  "Successful!",
                  "success"
                );
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire("Cancelled", '', "error");
          }
        });
    } else {
      this.checkAdmin();
    }
  }

  async checkAdmin() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user.user_type == "ADMIN") {
      this.isAdmin = true;
      //this.updateItemDetails();
      return true;
    }
    const { value: formValues } = await Swal.fire({
      title: "Admin Email & Password",
      html:
        '<input id="swal-input1" class="swal2-input" Placeholder="Email">' +
        '<input id="swal-input2" class="swal2-input" Placeholder="Password">',
      focusConfirm: false,
      preConfirm: () => {
        this.adminData.email = $("#swal-input1").val();
        this.adminData.password = $("#swal-input2").val();
        return;
      },
    });

    if (formValues) {
      this.homeService.checkAdmin(this.adminData).then((res) => {
        if (res.status === true) {
          this.isAdmin = true;
        } else {
          Swal.fire({
            type: "warning",
            title: "Oops...",
            text: "Wrong Email, Password.",
            showConfirmButton: false,
          });
          setTimeout(() => {
            this.checkAdmin();
          }, 1000);
        }
      });
    }
    return;
  }

  deleteItemDetails(item) {
    let allParams = {
      item_id: item.item_id,
      order_id: item.item_order_id,
    };
    this.resetItemDetails();

    this.orderId = item.item_order_id;

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success modal-button",
        cancelButton: "btn btn-danger modal-button",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Do you want delete?",
        text: "Please check all the details!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.purchaseListService.deleteItemDetails(allParams)
            .then((response) => {
              this.getPurchaseDetails(this.orderId, 0);
              this.getPurcheseList();

              swalWithBootstrapButtons.fire(
                "Item has been deleted successful!",
                "Successful!",
                "success"
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire("Cancelled", '', "error");
        }
      });
  }
}
