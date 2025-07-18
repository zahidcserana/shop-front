import { Component, OnInit } from '@angular/core';
import { SaleDayWiseReportModel } from '../models/sale.model';
import { SaleService } from '../services/sale.service';
import * as $ from 'jquery';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { FORMAT_SEARCH } from 'src/app/common/_classes/functions';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-sale-reports',
  templateUrl: './sale-reports.component.html',
  styleUrls: ['./sale-reports.component.css']
})
export class SaleReportsComponent implements OnInit {
  selectedMonth: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  dataList: SaleDayWiseReportModel[] = [];
  filter = {
    year_month: ''
  }
  sammary = {
    total_sale_amount: 0.00,
  }
  isAdmin = false;
  constructor(
    private saleService: SaleService,
  ) {}

  customLoader = true;
  showEmptyTable = false;

  ngOnInit() {
    this.getdayWiseReport(this.filter);

    this.bsConfig = {
      dateInputFormat: 'YYYY-MM',
      minMode: 'month',
      showWeekNumbers: false,
      containerClass: 'theme-default'
    };
  }

   onMonthChange(date: Date | null): void {
    if (!date) {
      this.filter.year_month = '';
      return;
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const query = `${year}-${month}`;

    this.filter.year_month = query;

    // Optional: auto-load report
    this.getdayWiseReport(this.filter);
  }

  getdayWiseReport(q) {
    let filterItem = FORMAT_SEARCH(this.filter);

    this.customLoader = true;
    this.saleService.dayWiseReport(filterItem)
      .subscribe(res => {
        this.dataList = res;
        this.sammary.total_sale_amount = this.dataList.reduce((sum, item) => sum + Number(item.amount), 0);
        this.customLoader = false;
      });
  }
  trackList(index, pro) {
    return pro ? pro.id : null;
  }
  
  exportSaleReport(): void {
    const table = document.getElementById('sale-days-report'); // we'll give the table an ID
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sale Days Report': worksheet },
      SheetNames: ['Sale Report']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const data: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });
    FileSaver.saveAs(data, 'Sale_Days_Report.xlsx');
  }
}
