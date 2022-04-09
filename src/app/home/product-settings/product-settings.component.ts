import { Component, OnInit } from "@angular/core";
import { ProductSettingsService } from "./services/product-settings.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription, Observable, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap,
  catchError,
} from "rxjs/operators";
import Swal from "sweetalert2";
import * as $ from "jquery";
import { HomeService } from "../services/home.service";

@Component({
  selector: "app-product-settings",
  templateUrl: "./product-settings.component.html",
  styleUrls: ["./product-settings.component.css"],
})
export class ProductSettingsComponent implements OnInit {
  loader: boolean;
  allBrandList: any[] = [];
  allTypeList: any[] = [];

  swalWithBootstrapButtons = null;

  typeDetails: any = {
    type: "",
    type_id: "",
  };

  brandDetails: any = {
    name: '',
    brand_id: '',
  };

  constructor(
    private productSettingsService: ProductSettingsService,
    private homeService: HomeService
  ) {
    this.swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success modal-button",
        cancelButton: "btn btn-warning modal-button",
      },
      buttonsStyling: false,
    });
  }

  ngOnInit() {
    this.getBrandList();
    this.getProductTypeList();
  }

  newType() {
    this.typeDetails.type_id = null;
    this.typeDetails.type = null;
    $("#medicine_type").focus();
  }

  editType(item) {
    $("#medicine_type").focus();
    console.log(item);
    this.typeDetails.type = item.name;
    this.typeDetails.type_id = item.id;
  }

  deleteType(item) {
    console.log(item);
    this.swalWithBootstrapButtons
    .fire({
      title: '"' + item.name + '"',
      text: 'Do you want to delete?',
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.value) {
        this.productSettingsService
        .deleteType(item.id)
        .subscribe(res => {
          if (res.status === true) {
            Swal.fire({
              position: "center",
              type: "success",
              title: "Done",
              showConfirmButton: false,
              timer: 1500
            });
            this.getProductTypeList();
          }
        });
      }
    });
  }

  newBrand() {
    this.brandDetails.brand_id = null;
    this.brandDetails.name = null;
    $("#brand").focus();
  }

  editBrand(item) {
    $("#brand").focus();
    console.log(item);
    this.brandDetails.name = item.name;
    this.brandDetails.brand_id = item.id;
  }

  deleteBrand(item) {
    console.log(item);
    this.swalWithBootstrapButtons
    .fire({
      title: '"' + item.name + '"',
      text: 'Do you want to delete?',
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.value) {
        this.productSettingsService
        .deleteBrand(item.id)
        .subscribe(res => {
          if (res.status === true) {
            Swal.fire({
              position: "center",
              type: "success",
              title: "Done",
              showConfirmButton: false,
              timer: 1500
            });
            this.getBrandList();
          }
        });
      }
    });
  }

  AddNewType() {
    console.log(this.typeDetails);
    if (this.typeDetails.type.trim()) {
      if (!this.typeDetails.type_id) {
        this.swalWithBootstrapButtons
          .fire({
            title: '"' + this.typeDetails.type + '"',
            text: 'Do you want to add?',
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.value) {
              this.saveType();
            }
          });
      } else {
        this.saveType();
      }
    }
  }

  saveType() {
    this.productSettingsService
      .UpdateTypeDetails(this.typeDetails)
      .then((response) => {
        if (response.status) {
          this.swalWithBootstrapButtons.fire({
            position: "center",
            type: "success",
            title: response.message,
            showConfirmButton: false,
            timer: 2000
          });
          this.typeDetails.type_id = "";
          this.typeDetails.type = "";
          this.getProductTypeList();
        } else {
          this.swalWithBootstrapButtons.fire(
            "Opps..",
            response.message,
            "error"
          );
          this.typeDetails.type_id = "";
          this.typeDetails.type = "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  AddNewBrand() {
    console.log(this.brandDetails);
    if (this.brandDetails.name.trim()) {
      if (!this.brandDetails.brand_id) {
        this.swalWithBootstrapButtons
          .fire({
            title: '"' + this.brandDetails.name + '"',
            text: 'Do you want to add?',
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.value) {
              this.saveBrand();
            }
          });
      } else {
        this.saveBrand();
      }
    }
  }

  saveBrand() {
    this.productSettingsService
      .saveBrand(this.brandDetails)
      .then((response) => {
        if (response.status) {
          this.swalWithBootstrapButtons.fire({
            position: "center",
            type: "success",
            title: response.message,
            showConfirmButton: false,
            timer: 2000
          });
          this.brandDetails.brand_id = "";
          this.brandDetails.name = "";
          this.getBrandList();
        } else {
          this.swalWithBootstrapButtons.fire(
            "Opps..",
            response.message,
            "error"
          );
          this.brandDetails.brand_id = "";
          this.brandDetails.name = "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getBrandList() {
    this.productSettingsService
      .getBrandList()
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
        this.allBrandList = response;
      });
  }

  getProductTypeList() {
    this.productSettingsService
      .getProductType()
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
        this.allTypeList = response;
      });
  }
}
