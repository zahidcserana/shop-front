import { HomeService } from 'src/app/home/services/home.service';
import { MasterProductsModel } from './../../models/setting.model';
import { SettingService } from './../../services/setting.service';
import { Component, OnInit } from '@angular/core';
import { Pagi } from 'src/app/common/modules/pagination/pagi.model';
import { catchError, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import * as $ from 'jquery';

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
  constructor(
    private settingService: SettingService,
    private homeService: HomeService
  ) {
    this.filter = this.filter ? this.filter : '';
    this.pagi.limit = this.pagi.limit ? this.pagi.limit : 500;
    this.pagi.page = this.pagi.page ? this.pagi.page : 1;
  }

  customLoader = true;
  showEmptyTable = false;

  ngOnInit() {
    this.getProductList(this.pagi.page, this.pagi.limit, this.filter);
  }
  ngAfterViewInit() {
    this.getCompanyList();
    this.getProductTypeList();
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
  allTypeList: any[] = [];
  typeList: any[] = [];
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
      return this.typeList;
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
  deleteProduct(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.delete(id);
      }
    })
  }
  delete(id) {
    this.settingService.deleteProduct(id).then(
      res => {
        if (res.success === true) {
          Swal.fire({
            position: "center",
            type: "success",
            title: "Product successfully deleted.",
            showConfirmButton: false,
            timer: 1500
          });
          this.getProductList(this.pagi.page, this.pagi.limit, this.filter);
        } else {
          Swal.fire({
            type: "warning",
            title: res.error,
            text: "Something went wrong!"
          });
        }
      }
    ).catch(
      err => {
        Swal.fire({
          type: "warning",
          title: "Oops...",
          text: "Something went wrong!"
        });
      }
    );
  }

  editProduct(product) {
    this.productInfo.medicine = product.brand_name;
    this.productInfo.company = product.medicine_company;
    this.productInfo.type = product.medicine_type;
    this.productInfo.generic = product.generic_name;
    this.product_id = product.medicine_id;
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
    );
  update() {
    if (this.productInfo.company) {
      this.getCompanyId();
    }
    if (this.productInfo.type) {
      this.getTypeId();
    }

    console.log(this.productInfo);

    if(this.productInfo.type_id && this.productInfo.company_id){
      this.settingService.editProduct(this.product_id, this.productInfo).then(
        res => {
          if (res.success === true) {
            $('#myForm').trigger('reset');
            this.product_id = null;
            Swal.fire({
              position: "center",
              type: "success",
              title: "Product Data successfully updated.",
              showConfirmButton: false,
              timer: 1500
            });
            this.getProductList(this.pagi.page, this.pagi.limit, this.filter);
          } else {
            Swal.fire({
              type: "warning",
              title: res.error,
              text: "Something went wrong!"
            });
          }
        }
      ).catch(
        err => {
          Swal.fire({
            type: "warning",
            title: "Oops...",
            text: "Something went wrong!"
          });
        }
      );
    }else{
      Swal.fire({
        type: "warning",
        title: "Oops...",
        text: "Please Check all the details!"
      });
    }

  }
}
