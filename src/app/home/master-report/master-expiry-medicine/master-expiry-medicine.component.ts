import { MasterReportService } from './../master-report.service';
import { Component, OnInit } from '@angular/core';
import { Pagi } from 'src/app/common/modules/pagination/pagi.model';

@Component({
  selector: 'app-master-expiry-medicine',
  templateUrl: './master-expiry-medicine.component.html',
  styleUrls: ['./master-expiry-medicine.component.css']
})
export class MasterExpiryMedicineComponent implements OnInit {
  dataList: any;
  pagi: Pagi = new Pagi();
  filter: string;

  constructor(private masterReportServce: MasterReportService) { 
    this.filter = this.filter ? this.filter : '';
    this.pagi.limit = this.pagi.limit ? this.pagi.limit : 500;
    this.pagi.page = this.pagi.page ? this.pagi.page : 1;
  }

  ngOnInit() {
    this.getList(this.pagi.page, this.pagi.limit, this.filter);
  }
  reloadTable(e) {
    this.getList(e.page, e.limit, e.filter);
  }
  trackList(index, pro) {
    return pro ? pro.id : null;
  }
  private setData(res) {
    this.pagi.total = res['total'] || 0;
    this.pagi.page = parseInt(res['page_no']) || 1;
    this.pagi.limit = parseInt(res['limit']) || 500;
  }
  getList(p, l, q) {
    this.masterReportServce.getExpiryMedicine(p, l, q)
      .subscribe(res => {
        this.dataList = res.data;
        this.setData(res);
      });
  }
  filterList(e) {
    this.filter = e;
    this.getList(1, 500, this.filter);
  }
  expStatus(s) {
    return this.masterReportServce.expStatus(s);
  }
}
