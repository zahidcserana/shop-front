import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { InventoryService } from './services/inventory.service';
import * as $ from "jquery";
import Swal from 'sweetalert2';
import { Pagi } from 'src/app/common/modules/pagination/pagi.model';
import { ModalService } from 'src/app/common/_modal/modal.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  pagi: Pagi = new Pagi();
  currency = '৳';
  
  constructor(
    private InventoryService: InventoryService,
    private modalService: ModalService,
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

  itemDetails: any = {
    medicine_name: '',
    barcode: ''
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

  openModal(item: object, modal: string) {
    $('#print-div').show();
    $('#close-div').show();
    this.itemDetails = item;
    this.modalService.open(modal);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }
  printInvoice(printArea) {
    $('#print-div').hide();
    $('#close-div').hide();

    var divToPrint = document.getElementById(printArea);
    var strHead = "<html>\n<head><style>";
    strHead += "#invoice-POS{box-shadow:0 0 1in -.25in rgba(0,0,0,.5);padding:2mm;margin:0 auto;width:44mm;background:#fff}::selection{background:#f31544;color:#fff}::moz-selection{background:#f31544;color:#fff}h1{font-size:1.5em;color:#222}h2{font-size:.9em}h3{font-size:1.2em;font-weight:300;line-height:2em}p{font-size:.7em;color:#666;line-height:1.2em}#bot,#mid,#top{border-bottom:1px solid #eee}#top{min-height:100px}#mid{min-height:80px}#bot{min-height:50px}#top .logo{float:left;height:60px;width:60px;background:url(http://michaeltruong.ca/images/logo1.png) no-repeat;background-size:60px 60px}.clientlogo{float:left;height:60px;width:60px;background:url(http://michaeltruong.ca/images/client.jpg) no-repeat;background-size:60px 60px;border-radius:50px}.info{display:block;float:left;margin-left:0}.title{float:right}.title p{text-align:right}table{width:100%;border-collapse:collapse}td{padding:5px 0 5px 15px;border:1px solid #eee}.tabletitle{padding:5px;font-size:.5em;background:#eee}.service{border-bottom:1px solid #eee}.item{width:24mm}.itemtext{font-size:.5em}#legalcopy{margin-top:5mm}";
    strHead += "</style>\n <link rel=\"stylesheet\" type=\"text/css\"  href=\"/assets/css/bootstrap.min.css\">\n <link rel=\"stylesheet\" type=\"text/css\"  href=\"/css/agent_style.css\">\n <link rel=\"stylesheet\" type=\"text/css\"  href=\"/afcview/dist/css/AdminLTE.css\">\n<style>#invoice_modal_id{font-size: 10px;}#invoice_modal_id td{padding: 2px;}</style></head><body style=\"font-size: 10px;\"><div><center>\n"
      + divToPrint.innerHTML + "\n</center></div>\n</body>\n</html>";

    var w = window.open();
    $(w.document.body).html(strHead);
    w.print();
    window.location.reload();
  }
}
