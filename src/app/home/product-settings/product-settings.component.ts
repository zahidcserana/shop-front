import { Component, OnInit } from '@angular/core'
import { ProductSettingsService } from './services/product-settings.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription, Observable, of } from 'rxjs'
import {
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap,
  catchError
} from 'rxjs/operators'
import Swal from 'sweetalert2'
import * as $ from 'jquery'
import { HomeService } from '../services/home.service'

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrls: ['./product-settings.component.css']
})
export class ProductSettingsComponent implements OnInit {
  loader: boolean
  loader_sub: boolean
  sub: Subscription
  companyList: any[] = []
  allCompanyList: any[] = []
  allTypeList: any[] = []
  companyOld = ''
  typeOld = ''

  typeList = []

  productDetails: any = {
    company: '',
    product_name: '',
    generic: '',
    power: '',
    type: '',
    type_id: '',
    product_type: '1'
  }

  companyDetails: any = {
    company: ''
  }

  typeDetails: any = {
    type: '',
    type_id: ''
  }

  searchData: any[] = []
  typeSearch: any = {
    search: ''
  }

  constructor (
    private productSettingsService: ProductSettingsService,
    private homeService: HomeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit () {
    this.sub = this.route.data.subscribe(val => {
      this.companyList = val && val.companies ? val.companies : []
    })
    this.getCompanyList()
    this.getProductTypeList()
  }

  setCompany (item) {
    this.companyOld = item.item
  }

  setType (item) {
    this.typeOld = item.item
  }

  AddNewType () {
    for (const type of this.searchData) {
      if (type.name == this.typeDetails.type.trim()) {
        this.typeDetails.type_id = type.id
      }
    }
    console.log(this.typeDetails)

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success modal-button',
        cancelButton: 'btn btn-warning modal-button'
      },
      buttonsStyling: false
    })

    this.typeDetails.type = this.typeDetails.type.trim()
    if (this.typeDetails.type) {
      swalWithBootstrapButtons
        .fire({
          title: '"' + this.typeDetails.type + '"<br> Do you want add?',
          text: 'Please check all the details!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Add',
          cancelButtonText: 'Modify',
          reverseButtons: true
        })
        .then(result => {
          if (result.value) {
            if (!this.typeDetails.type_id) {
              this.productSettingsService
                .submitProductType(this.typeDetails)
                .then(response => {
                  $('#medicine_type').focus()

                  if (response.status) {
                    swalWithBootstrapButtons.fire(
                      'Product type added successful!',
                      'Successful!',
                      'success'
                    )
                    this.typeDetails.type_id = ''
                    this.typeDetails.type = ''
                    this.getProductTypeList()
                  } else {
                    swalWithBootstrapButtons.fire(
                      'Opps..',
                      'The Product type already exist!',
                      'error'
                    )
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            } else {
              swalWithBootstrapButtons.fire(
                'Opps..',
                'Please check all the details!',
                'error'
              )
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              title: 'Change Type:',
              inputAttributes: {
                autocapitalize: 'off'
              },
              html:
                '<p style="margin-bottom: 0;"><strong>' +
                this.typeDetails.type +
                '</strong></p><input id="type_name" type="text" value="' +
                this.typeDetails.type +
                '" class="swal2-input">',
              showCancelButton: true,
              confirmButtonText: 'Update'
            }).then(new_result => {
              if (new_result.value) {
                let type_name = $('#type_name').val()

                this.typeDetails.type = this.typeDetails.type.trim()
                let update_type = type_name.trim()

                let data = {
                  old_type_id: this.typeDetails.type_id,
                  old_type: this.typeOld,
                  new_type: update_type
                }

                if (this.typeOld) {
                  this.productSettingsService
                    .UpdateTypeDetails(data)
                    .then(response => {
                      $('#medicine_type').focus()
                      if (response.status) {
                        swalWithBootstrapButtons.fire(
                          'Type Updated successful!',
                          'Successful!',
                          'success'
                        )
                        this.typeDetails.type_id = ''
                        this.typeDetails.type = ''
                        this.getProductTypeList()
                      } else {
                        swalWithBootstrapButtons.fire(
                          'Opps..',
                          'Please Check the details!',
                          'error'
                        )
                        this.typeDetails.type_id = ''
                        this.typeDetails.type = ''
                      }
                    })
                    .catch(err => {
                      console.log(err)
                    })
                } else {
                  swalWithBootstrapButtons.fire(
                    'Opps..',
                    'Please Check the details!',
                    'error'
                  )
                  this.typeDetails.type_id = ''
                  this.typeDetails.type = ''
                }
              }
            })
          }
        })
    } else {
      if (!this.typeDetails.type) {
        swalWithBootstrapButtons.fire(
          'Opps..',
          'Please check all the details!',
          'error'
        )
      } else {
        swalWithBootstrapButtons.fire(
          'Opps..',
          'The type already exist!',
          'error'
        )
      }
      this.typeDetails.type_id = ''
      this.typeDetails.type = ''
    }
  }

  AddCompany () {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success modal-button',
        cancelButton: 'btn btn-warning modal-button'
      },
      buttonsStyling: false
    })
    if (this.companyDetails.company) {
      swalWithBootstrapButtons
        .fire({
          title:
            '"' +
            this.companyDetails.company +
            '" <br> Do you want Add or Modify?',
          text: 'Please check all the details!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Add',
          cancelButtonText: 'Modify',
          reverseButtons: true
        })
        .then(result => {
          if (result.value) {
            this.companyDetails.company = this.companyDetails.company.trim()
            this.productSettingsService
              .submitCompanyDetails(this.companyDetails)
              .then(response => {
                $('#typeahead-basic').focus()
                if (response.status) {
                  swalWithBootstrapButtons.fire(
                    'Company added successful!',
                    'Successful!',
                    'success'
                  )
                  this.companyDetails.company = ''
                  this.getCompanyList()
                  this.getCompanies()
                } else {
                  swalWithBootstrapButtons.fire(
                    'Opps..',
                    'Company information already exist!',
                    'error'
                  )
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              title: 'Change the name of',
              inputAttributes: {
                autocapitalize: 'off'
              },
              html:
                '<p style="margin-bottom: 0;"><strong>' +
                this.companyDetails.company +
                '</strong></p><input id="company_name" type="text" value="' +
                this.companyDetails.company +
                '" class="swal2-input">',
              showCancelButton: true,
              confirmButtonText: 'Update'
            }).then(result => {
              if (result.value) {
                let company_name = $('#company_name').val()

                this.companyDetails.company = this.companyDetails.company.trim()
                let update_company = company_name.trim()

                let data = {
                  old_company: this.companyOld,
                  new_company: update_company
                }

                this.productSettingsService
                  .UpdateCompanyDetails(data)
                  .then(response => {
                    $('#typeahead-basic').focus()
                    if (response.status) {
                      swalWithBootstrapButtons.fire(
                        'Company Updated successful!',
                        'Successful!',
                        'success'
                      )
                      this.companyDetails.company = ''
                      this.getCompanyList()
                      this.getCompanies()
                    } else {
                      swalWithBootstrapButtons.fire(
                        'Opps..',
                        'Please Check the details!',
                        'error'
                      )
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            })
          }
        })
    } else {
      swalWithBootstrapButtons.fire(
        'Opps..',
        'Please check all the details!',
        'error'
      )
    }
  }

  getCompanyList () {
    this.productSettingsService
      .getCompanyList()
      .pipe(
        map(response => {
          return response
        }),
        catchError(err => {
          this.loader = false
          return of([])
        })
      )
      .subscribe(response => {
        this.loader = false
        this.allCompanyList = response
      })
  }

  getCompanies () {
    this.homeService
      .getCompanies()
      .pipe(
        map(response => {
          return response
        }),
        catchError(err => {
          this.loader = false
          return of([])
        })
      )
      .subscribe(response => {
        this.loader = false
        this.companyList = response
      })
  }

  getProductTypeList () {
    this.productSettingsService
      .getProductType()
      .pipe(
        map(response => {
          return response
        }),
        catchError(err => {
          this.loader = false
          return of([])
        })
      )
      .subscribe(response => {
        this.loader = false
        this.allTypeList = response
      })
  }

  company_search = (company$: Observable<string>) =>
    company$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2
          ? []
          : this.companyList
              .filter(
                name => name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    )

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchData = []
        this.loader_sub = true
      }),
      switchMap(term => {
        this.loader_sub = true
        this.typeSearch.search = term.trim()
        return this.getTypeList(this.typeSearch)
      })
    )
  }

  getTypeList (params): any {
    if (!params && params === '') {
      this.loader_sub = false
      return []
    }

    return this.productSettingsService.searchProductType(params).pipe(
      map(res => {
        this.typeList = []
        this.loader_sub = false
        this.searchData = res
        for (let medicine of res) {
          this.typeList.push(medicine.name)
        }
        return this.typeList
      }),
      catchError(() => {
        this.loader_sub = false
        return []
      })
    )
  }
}
