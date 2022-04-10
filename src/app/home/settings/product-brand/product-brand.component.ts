import { HomeService } from 'src/app/home/services/home.service';
import { MasterProductsModel } from './../../models/setting.model';
import { SettingService } from './../../services/setting.service';
import { Component, OnInit } from '@angular/core';
import { Pagi } from 'src/app/common/modules/pagination/pagi.model';
import { catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { ProductService } from '../../product/services/product.service';
import { ModalService } from 'src/app/common/_modal';

@Component({
  selector: 'app-product-brand',
  templateUrl: './product-brand.component.html',
  styleUrls: ['./product-brand.component.css']
})
export class ProductBrandComponent implements OnInit {
  pagi: Pagi = new Pagi();
  filter: string;
  dataList: MasterProductsModel[] = [];
  product_id: number;
  allBrandList: any[] = [];
  allTypeList: any[] = [];
  allSupplierList: any[] = [];
  productList = [];
  typeList: any[] = [];

  customLoader = true;
  showEmptyTable = false;
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

  productInfo: any = {
    company_id: '',
    company_name: '',
    medicine_id: '',
    medicine: '',
    type: '',
    type_id: '',
    generic: ''
  };
  companyList: any;
  swalWithBootstrapButtons = null;

  constructor(
    private productService: ProductService,
    private settingService: SettingService,
    private homeService: HomeService,
    private modalService: ModalService,
  ) {
    this.filter = this.filter ? this.filter : '';
    this.pagi.limit = this.pagi.limit ? this.pagi.limit : 500;
    this.pagi.page = this.pagi.page ? this.pagi.page : 1;

    this.swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success modal-button',
        cancelButton: 'btn btn-danger modal-button'
      },
      buttonsStyling: false
      });
  }

  ngOnInit() {
    this.getProductList(this.pagi.page, this.pagi.limit, this.filter);
  }

  ngAfterViewInit() {
    // this.getCompanyList();
    this.getProductTypeList();
    // this.getSupplierList();
    this.getBrandList();
    // this.getTypeList();
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
        this.getProductList(this.pagi.page, this.pagi.limit, this.filter);
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

  /* company search start */
  CompanySearchData: any;

  getCompanyList() {
    this.homeService.getCompanyList().pipe(map(response => {
      return response;
    }), catchError(err => {
      return of([]);
    })).subscribe(response => {
      this.companyList = [];
      this.CompanySearchData = response;
      for (let s of response) {
        this.companyList.push(s.name);
      }
      return this.companyList;
    });
  }
  getCompanyId() {
    for (let s of this.CompanySearchData) {
      if (s.name == this.productInfo.company.trim()) {
        this.productInfo.company_id = s.id;
      }
    }
  }
  /* company search end */

  /* Type search start */
  getProductTypeList() {
    this.homeService.getProductType().pipe(map(response => {
      return response;
    }), catchError(err => {
      return of([]);
    })).subscribe(response => {
      this.allTypeList = response;

      this.typeList = [];
      for (let s of response) {
        this.typeList.push(s.name);
      }
    });
  }
  type_search = (type$: Observable<string>) =>
    type$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.typeList.filter(name => name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  getTypeId() {
    for (let s of this.allTypeList) {
      if (s.name == this.productInfo.type.trim()) {
        this.productInfo.type_id = s.id;
      }
    }
  }
  /* Type search start */

  getProductList(p, l, q) {
    this.customLoader = true;
    this.settingService.getProducts(p, l, q)
      .subscribe(res => {
        this.dataList = res.data;
        this.productList = res.data;
        this.customLoader = false;
        if(!this.dataList.length){
          this.showEmptyTable = true;
        }else{
          this.showEmptyTable = false;
        }
        this.setData(res);
      });
  }
  reloadTable(e) {
    this.getProductList(e.page, e.limit, e.filter);
  }
  trackList(index, pro) {
    return pro ? pro.id : null;
  }
  private setData(res) {
    this.pagi.total = res['total'] || 0;
    this.pagi.page = parseInt(res['page_no']) || 1;
    this.pagi.limit = parseInt(res['limit']) || 500;
  }
  filterList(e) {
    this.filter = e;
    this.getProductList(1, 500, this.filter);
  }

  closeForm() {
    $('#myForm').trigger('reset');
    this.product_id = null;
  }
  company_search = (company$: Observable<string>) =>
    company$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.companyList.filter(name => name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  getSupplierList() {
    this.productService.getCompanyList().pipe(map(response => {
      return response;
    }), catchError(err => {
      return of([]);
    })).subscribe(response => {
      this.allSupplierList = response;
    });
  }

  getBrandList() {
    this.productService.getBrandList().pipe(map(response => {
      return response;
    }), catchError(err => {
      return of([]);
    })).subscribe(response => {
      this.allBrandList = response;
    });
  }

  getTypeList() {
    this.productService.getProductType().pipe(map(response => {
      return response;
    }), catchError(err => {
      return of([]);
    })).subscribe(response => {
      this.allTypeList = response;
    });
  }


  AddProduct() {
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
              this.getProductList(this.pagi.page, this.pagi.limit, this.filter);
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
              this.getProductList(this.pagi.page, this.pagi.limit, this.filter);
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
            console.log(err);
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
