import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import * as $ from "jquery";
import Swal from 'sweetalert2';
import { ProductService } from './services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/common/_modal';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  loader: boolean;
  loader_sub: boolean;
  sub: Subscription;
  companyList: any[] = [];

  allCompanyList: any[] = [];
  allBrandList: any[] = [];
  allTypeList: any[] = [];

  productDetails: any = {
    id: undefined,
    company: '',
    product_name: '',
    generic: '',
    power: '',
    type: '',
    brand_id: '',
    type_id: '',
    product_type: '1'
  };

  typeList = [];
  productList = [];

  searchData: any[] = [];
  typeSearch: any = {
    search: ''
  };

  customLoader = true;
  showEmptyTable = false;
  editForm = false;
  swalWithBootstrapButtons = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
  ) {
     this.swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success modal-button',
        cancelButton: 'btn btn-danger modal-button'
      },
      buttonsStyling: false
    });
   }

  ngOnInit() {
    this.getProductList();
    this.getCompanyList();
    this.getBrandList();
    this.getProductTypeList();
  }

  openModal(modal: string) {
    this.modalService.open(modal);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

  editProduct(id) {
    console.log(id);
    const product = this.productList.find(element => element.id === id);
    console.log(product);
    this.productDetails.id = product.id;
    this.productDetails.product_name = product.brand_name;
    this.productDetails.brand_id = product.brand_id;
    this.productDetails.type = product.medicine_type_id;
    this.productDetails.generic = product.generic_name;

    this.editForm = true;
    this.modalService.open('edit-modal');
  }

  deleteProduct(id) {
    const product = this.productList.find(element => element.id === id);
    this.swalWithBootstrapButtons.fire({
      title: 'Do you want to delete this product?',
      text: product.brand_name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.remove(id);
      }
    });
  }


  remove(id) {
    this.productService
    .deleteProduct(id)
    .subscribe(res => {
      if (res.success === true) {
        this.getProductList();
        Swal.fire({
          position: "center",
          type: "success",
          title: "Done",
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  getCompanyList() {
    this.productService.getCompanyList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.allCompanyList = response;
    });
  }

  getBrandList(){
    this.productService.getBrandList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.allBrandList = response;
    });
  }

  getProductTypeList(){
    this.productService.getProductType().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.allTypeList = response;
    });
  }

  getProductList(){
    this.customLoader = true;
    this.productService.getProductList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.customLoader = false;
      this.productList = response.data;
    });
  }

  getTypeList(params): any {
    if (!params && params === "") {
      this.loader_sub = false;
      return [];
    }

    return this.productService.searchProductType(params).pipe(
      map(res => {
        this.typeList = [];
        this.loader_sub = false;
        this.searchData = res;
        for (let medicine of res) {
          this.typeList.push(medicine.name);
        }
        return this.typeList;
      }),
      catchError(() => {
        this.loader_sub = false;
        return [];
      })
    );
  };

  AddProduct(){
    if (this.productDetails.product_name && this.productDetails.type) {
      this.productDetails.type_id = this.productDetails.type;

      this.productDetails.product_name = this.productDetails.product_name.trim();
      console.log(this.productDetails);
      this.submitProductDetails();
      $("#product_name").focus();
    }
  }

  resetList(){
    this.productDetails = {
      company: '',
      product_name: '',
      generic: '',
      brand_id: '',
      type: '',
      type_id: '',
      product_type: '1'
    };
  }

  submitProductDetails() {
    this.swalWithBootstrapButtons.fire({
      title: 'Do you want submit product details?',
      text: "Please check all the details!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        if (this.productDetails.id) {
          this.productService.updateProduct(this.productDetails)
          .then(response => {
            this.modalService.close('edit-modal');
            $('#product_name').focus();
            if (response.status) {
              this.swalWithBootstrapButtons.fire(
                'Product details submitted successful!',
                'Successful!',
                'success'
              );
              this.getProductList();
            }else{
              this.swalWithBootstrapButtons.fire(
                'Opps..',
                'The Product information already exist!',
                'error'
              );
            }

            this.resetList();
          })
          .catch(err => {
            console.log(err)
          });
        } else {
          this.productService.submitProduct(this.productDetails)
          .then(response => {
            $("#product_name").focus();
            if (response.status) {
              this.modalService.close('create-modal');
              this.swalWithBootstrapButtons.fire(
                'Product details submitted successful!',
                'Successful!',
                'success'
              );
              this.getProductList();
            }else{
              this.swalWithBootstrapButtons.fire(
                'Opps..',
                'The Product information already exist!',
                'error'
              );
            }

            this.resetList();
          })
          .catch(err => {
            console.log(err)
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.swalWithBootstrapButtons.fire(
          'Cancelled',
          '',
          'error'
        );
        this.productDetails.type_id = '';
      }
    });
  }

}


