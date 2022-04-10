import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MasterProductsFilterModel } from 'src/app/home/models/setting.model';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FORMAT_SEARCH } from 'src/app/common/_classes/functions';
import { debounceTime, distinctUntilChanged, map, catchError, tap, switchMap } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../../services/home.service';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-filter-product',
  templateUrl: './filter-product.component.html',
  styleUrls: ['./filter-product.component.css']
})
export class FilterProductComponent implements OnInit {
  filterData: any = {
    company_id: '',
    company_name: '',
    medicine_id: '',
    medicine: '',
    type: '',
    type_id: '',
    generic: ''
  };
  allTypeList: any[] = [];
  companyList: any[] = [];
  filter: string;
  search: boolean;
  CompanySearchData: any;
  typeList: any[] = [];
  searchData: any[] = [];
  medicineSearch: any = {
    search: ''
  };
  searchList: any[];
  medicineList = [];
  @ViewChild('typeaheadInstance')
  private typeaheadInstance: NgbTypeahead;
  sub: Subscription;
  @Output() loadList: EventEmitter<string> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    private saleService: SaleService
  ) { }

  ngOnInit() {
    this.getCompanyList();
    this.getProductTypeList();
  }
  getProductTypeList() {
    this.homeService.getProductType().pipe(map(response => {
      return response;
    }), catchError(err => {
      return of([]);
    })).subscribe(response => {
      this.allTypeList = response;

      this.typeList = [];
      for (const s of response) {
        this.typeList.push(s.name);
      }
      return this.typeList;
    });
  }

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
    for (const s of this.CompanySearchData) {
      if (s.name == this.filterData.company_name) {
        this.filterData.company_id = s.id;
      }
    }
  }

  reset() {
    this.filterData = new MasterProductsFilterModel();
  }
  searchfilterData() {
    if (this.filterData.medicine) {
      this.getMedicineId();
    }
    if (this.filterData.company_name) {
      this.getCompanyId();
    }
    if (this.filterData.type) {
      this.getTypeId();
    }
    this.filter = FORMAT_SEARCH(this.filterData);
    if (this.filter) {
      this.loadList.emit(this.filter);
      this.search = true;
    }
  }
  resetSearch() {
    this.reset();
    this.filter = null;
    if (this.search) {
      this.loadList.emit("");
      this.search = false;
    }
  }
  company_search = (company$: Observable<string>) =>
    company$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.companyList.filter(name => name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  type_search = (type$: Observable<string>) =>
    type$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.typeList.filter(name => name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  getTypeId() {
    for (let s of this.allTypeList) {
      if (s.name == this.filterData.type) {
        this.filterData.type_id = s.id;
      }
    }
  }

  /** Start Medicine search */
  medicine_search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchData = [];
      }),
      switchMap(term => {
        this.medicineSearch.search = term;
        if (this.medicineSearch.search.length > 1) {
          return this.getMedicineList(this.medicineSearch);
        }
        return [];
      })
    );
  }

  typeaheadKeydown($event: KeyboardEvent) {
    if (this.typeaheadInstance.isPopupOpen()) {
      setTimeout(() => {
        const popup = document.getElementById(this.typeaheadInstance.popupId);
        const activeElements = popup.getElementsByClassName('active');
        if (activeElements.length === 1) {
          const elem = (activeElements[0] as any);
          if (typeof elem.scrollIntoViewIfNeeded === 'function') {
            elem.scrollIntoViewIfNeeded();
          } else {
            this.scrollIntoViewIfNeededPolyfill(elem as HTMLElement);
          }
        }
      });
    }
  }
  private scrollIntoViewIfNeededPolyfill(elem: HTMLElement, centerIfNeeded = true) {
    let parent = elem.parentElement,
      parentComputedStyle = window.getComputedStyle(parent, null),
      parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
      parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
      overTop = elem.offsetTop - parent.offsetTop < parent.scrollTop,
      overBottom = (elem.offsetTop - parent.offsetTop + elem.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
      overLeft = elem.offsetLeft - parent.offsetLeft < parent.scrollLeft,
      overRight = (elem.offsetLeft - parent.offsetLeft + elem.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
      alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop = elem.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + elem.clientHeight / 2;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft = elem.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + elem.clientWidth / 2;
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      elem.scrollIntoView(alignWithTop);
    }
  };
  getMedicineList(params): any {
    if (!params && params === "") {
      return [];
    }
    return this.saleService.searchMedicineByPharmacy(params).pipe(
      map(res => {
        this.medicineList = [];
        this.searchData = res;
        for (let s of res) {
          this.medicineList.push(s.name);
        }
        return this.medicineList;
      }),
      catchError(() => {
        return [];
      })
    );
  }
  getMedicineId() {
    for (let s of this.searchData) {
      if (s.name == this.filterData.medicine) {
        this.filterData.medicine_id = s.id;
      }
    }
  }
}
