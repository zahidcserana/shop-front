import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { InventoryService } from './services/inventory.service';
import * as $ from "jquery";
import Swal from 'sweetalert2';
import { Pagi } from 'src/app/common/modules/pagination/pagi.model';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  pagi: Pagi = new Pagi();
  
  constructor(
    private InventoryService: InventoryService
  )
  {
    this.pagi.limit = this.pagi.limit ? this.pagi.limit : 500;
    this.pagi.page = this.pagi.page ? this.pagi.page : 1;
  }

  ngOnInit() {
    this.getInventoryDataList();
    this.getCompanyList();
  }

  loader: boolean;
  loader_sub: boolean;
  inventoryList = [];
  companyList: any[] = [];
  medicineList = [];
  typeList = [];

  paginationShow = true;
  customLoader = true;
  searchData: any[] = [];
  typeSearchData: any[] = [];
  summ: any[] = [];
  medicineSearch: any = {
    search: ""
  };

  typeSearch: any = {
    search: ""
  };

  summary: any = {
    total_tp: 0,
    total_mrp: 0,
    total_profit: 0
  }

  filterItem: any = {
    medicine: '',
    generic: '',
    medicine_id: '',
    company: 0,
    quantity: '',
    type: '',
    type_id: '',
    low_stock_qty: false,
  }

  private setData(res) {
    this.pagi.total = res['total'] || 0;
    this.pagi.page = parseInt(res['page_no']) || 1;
    this.pagi.limit = parseInt(res['limit']) || 500;
  }

  reloadTable(e) {
    this.getInventoryList(e.page, e.limit, e.filter);
  }

  getInventoryDataList() {
    //console.log(this.pagi);
    this.getInventoryList(this.pagi.page, this.pagi.limit, this.filterItem);
  }

  filterList() {
    for (let medicine of this.searchData) {
      if (medicine.name == this.filterItem.medicine) {
        this.filterItem.medicine_id = medicine.id;
      }
    }

    if (this.filterItem.company ||this.filterItem.generic || this.filterItem.medicine_id || this.filterItem.quantity || this.filterItem.type || this.filterItem.low_stock_qty) {
      this.loader = true;
      for (let type of this.typeSearchData) {
        if (type.name == this.filterItem.type) {
          this.filterItem.type_id = type.id;
        }
      }
      this.customLoader = true;
      this.paginationShow = false;
      this.pagi.page = 1;
      this.pagi.limit = 100;
      this.InventoryService.getInventoryFilterList(JSON.stringify(this.filterItem)).pipe(map(response => {
        this.customLoader = false;
        return response;
      }), catchError(err => {
        this.loader = false;
        return of([]);
      })).subscribe(response => {
        this.loader = false;
        this.inventoryList = response.data;
        this.summary = response.summary;
      });
    }
  }

  resetList() {
    this.filterItem = {
      medicine: '',
      medicine_id: '',
      company: 0,
      quantity: '',
      type: '',
      type_id: '',
      low_stock_qty: false,
    };
    this.paginationShow = true;
    this.getInventoryList(1, 100, this.filterItem);
  }

  getCompanyList() {
    this.InventoryService.getCompanyList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.companyList = response;
    });
  }

  getInventoryList(p, l, q) {
    this.customLoader = true;
    this.InventoryService.getInventoryListWithPagination(p, l, q).pipe(map(response => {
      this.customLoader = false;
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.inventoryList = response.data;
      this.summary = response.summary;
      this.setData(response);
    });
  }

  ChangeQty(item, index) {
    Swal.fire({
      title: 'Change the low stock quantity of ' + item.medicine_name,
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Update',
    }).then((result) => {
      if (result.value) {
        let data = { 'id': item.id, 'qty': result.value }

        this.InventoryService.updateLowStockQty(data)
          .then(response => {
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: 'Quantity Updated!',
              showConfirmButton: false,
              timer: 1500
            });
            item.low_stock_qty = result.value;
            $('#' + index).addClass('updated-low-stock');
          })
          .catch(err => {
            console.log(err)
          });
      }
    })
  }

  ChangeMrpTp(item, index) {
    console.log(item);
    Swal.fire({
      title: 'Change RPU & CPU of ' + item.medicine_name,
      inputAttributes: {
        autocapitalize: 'off'
      },
      html:
        '<p style="margin-bottom: 0;"><strong>RPU</strong></p><input id="item_mrp" type="number" value="' + item.mrp + '" class="swal2-input">' +
        '<p style="margin-bottom: 0;"><strong>CPU</strong></p><input id="item_tp" type="number" value="' + item.tp + '" class="swal2-input">',
      showCancelButton: true,
      confirmButtonText: 'Update',
    }).then((result) => {
      if (result.value) {
        let mrp = $('#item_mrp').val();
        let tp = $('#item_tp').val();

        let data = { 'id': item.id, 'mrp': mrp, 'tp': tp };

        this.InventoryService.updateMRPTP(data)
          .then(response => {
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: 'MRP Updated!',
              showConfirmButton: false,
              timer: 1500
            });
            item.mrp = mrp;
            item.tp = tp;
            $('#mrp' + index).addClass('updated-low-stock');
            $('#tp' + index).addClass('updated-low-stock');
          })
          .catch(err => {
            console.log(err)
          });
      }
    })
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchData = [];
        this.loader_sub = true;
      }),
      switchMap(term => {
        this.medicineSearch.search = term;
        if (this.medicineSearch.search.length > 1) {
          return this.getMedicineList(this.medicineSearch);
        }
        return [];
      })
    );
  };

  genericData: any[] = [];
  genericSearch: any = {
    search: ""
  };
  generic_search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.genericData = [];
      }),
      switchMap(term => {
        this.genericSearch.search = term;
        return this.getGenericList(this.genericSearch);
      })
    );
  };
  getGenericList(params): any {
    if (!params && params === "") {
      return [];
    }
    return this.InventoryService.getGenericList(params).then(res => {
      return this.genericData = res 
      });
  }

  search_type = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.typeSearchData = [];
        this.loader_sub = true;
      }),
      switchMap(term => {
        this.loader_sub = true;
        this.typeSearch.search = term.trim();
        return this.getTypeList(this.typeSearch);
      })
    );
  };

  getTypeList(params): any {
    if (!params && params === "") {
      this.loader_sub = false;
      return [];
    }

    return this.InventoryService.searchProductType(params).pipe(
      map(res => {
        this.typeList = [];
        this.loader_sub = false;
        this.typeSearchData = res;
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

  getMedicineList(params): any {
    if (!params && params === "") {
      this.loader_sub = false;
      return [];
    }

    return this.InventoryService.searchMedicine(params).pipe(
      map(res => {
        this.medicineList = [];
        this.loader_sub = false;
        this.searchData = res;
        for (let medicine of res) {
          this.medicineList.push(medicine.name);
        }
        return this.medicineList;
      }),
      catchError(() => {
        this.loader_sub = false;
        return [];
      })
    );
  }

}
