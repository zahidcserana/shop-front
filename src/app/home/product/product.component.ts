import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import * as $ from "jquery";
import Swal from 'sweetalert2';
import { ProductService } from './services/product.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(
      private ProductService: ProductService,
      private router: Router,
      private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    // this.sub = this.route.data.subscribe(
    //   val => {
    //     this.companyList = val && val['companies'] ? val['companies'] : [];
    //   }
    // );
    this.getProductList();
    this.getCompanyList();
    this.getProductTypeList();
  }

  loader: boolean;
  loader_sub: boolean;
  sub: Subscription;
  companyList: any[] = [];

  allCompanyList: any[] = [];
  allTypeList: any[] = [];

  productDetails: any = {
    company: '',
    product_name: '',
    generic: '',
    power: '',
    type: '',
    type_id: '',
    product_type: '1'
  }

  typeList = [];
  productList = [];

  searchData: any[] = [];
  typeSearch: any = {
    search: ""
  };

  customLoader = true;
  showEmptyTable = false;

  company_search = (company$: Observable<string>) =>
  company$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.companyList.filter(name => name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchData = [];
        this.loader_sub = true;
      }),
      switchMap(term => {
        this.loader_sub = true;
        this.typeSearch.search = term.trim();
        return this.getTypeList(this.typeSearch);
      })
    );
  };

  getCompanyList(){
    this.ProductService.getCompanyList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.allCompanyList = response;
    });
  }

  getProductTypeList(){
    this.ProductService.getProductType().pipe(map(response => {
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
    this.ProductService.getProductList().pipe(map(response => {
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

    return this.ProductService.searchProductType(params).pipe(
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
    if(this.productDetails.product_name && this.productDetails.company && this.productDetails.type)
    {
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
      power: '',
      type: '',
      type_id: '',
      product_type: '1'
    };
  }

  submitProductDetails()
  {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success modal-button',
        cancelButton: 'btn btn-danger modal-button'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Do you want submit product details?',
      text: "Please check all the details!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {

      if (result.value) {
        this.ProductService.submitProduct(this.productDetails)
        .then(response => {

          $("#product_name").focus();

          if(response.status){
            swalWithBootstrapButtons.fire(
              'Product details submitted successful!',
              'Successful!',
              'success'
            );
            this.getProductList();
          }else{
            swalWithBootstrapButtons.fire(
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
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          '',
          'error'
        );
        this.productDetails.type_id = '';
      }
    });
  }

}


