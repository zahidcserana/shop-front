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
import { DamageListService } from "./services/damage-list.service";
import { ModalService } from "src/app/common/_modal/modal.service";
import * as $ from "jquery";
import Swal from "sweetalert2";
import { Pagi } from "src/app/common/modules/pagination/pagi.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-damage-list',
  templateUrl: './damage-list.component.html',
  styleUrls: ['./damage-list.component.css'],
})
export class DamageListComponent implements OnInit {
  pagi: Pagi = new Pagi();
  filter: string;
  currency = '৳';

  loader: boolean;
  loader_sub: boolean;
  damageList = [];
  damageDetails: any;
  damage: any;
  orderId: any;

  updateDamageItem: any = {
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
    private damageListService: DamageListService,
    private modalService: ModalService,
    private toastr: ToastrService
  ) {
    this.pagi.limit = this.pagi.limit ? this.pagi.limit : 100;
    this.pagi.page = this.pagi.page ? this.pagi.page : 1;
  }

  ngOnInit() {
    this.getPurcheseList();
  }

  getPurcheseList() {
    this.getDamageList(this.pagi.page, this.pagi.limit, this.filter);
  }
  reloadTable(e) {
    this.getDamageList(e.page, e.limit, e.filter);
  }
  filterList(e) {
    this.filter = e;
    this.getDamageList(1, 500, this.filter);
  }
  private setData(res) {
    this.pagi.total = res["total"] || 0;
    this.pagi.page = parseInt(res["page_no"]) || 1;
    this.pagi.limit = parseInt(res["limit"]) || 500;
  }
  getDamageList(p, l, q) {
    this.customLoader = true;
    this.damageListService.getPurcheseList(p, l, q)
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
        this.damageList = response.data;
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
    this.getDamageDetails(orderId, modal);
  }

  closeModal(id: string) {
    this.modalService.close(id);
    this.damageDetails = [];
    this.damage = [];
  }

  getDamageDetails(orderId, modal) {
    this.damageListService.getPurcheseDetails(orderId).subscribe(
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
            this.damageDetails = response.data;
            this.damage = response.damage[0];
          }
        }
      }
    );
  }

  deleteDamageDetails(orderId) {
    Swal.fire({
      title: "Are you sure?",
      text: 'You won"t be able to revert this!',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.deleteDamage(orderId);
      }
    });
  }

  deleteDamage(orderId) {
    const data = { damage_id: orderId };

    this.damageListService.deleteDamageDetails(data)
      .then((response) => {
        if (response.status) {
          Swal.fire(
            "Damage details deleted successful!",
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
  }
}
