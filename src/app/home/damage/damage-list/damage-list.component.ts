import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  map,
  catchError,
} from "rxjs/operators";
import { DamageListService } from "./services/damage-list.service";
import { ModalService } from "src/app/common/_modal/modal.service";
import * as $ from "jquery";
import Swal from "sweetalert2";
import { Pagi } from "src/app/common/modules/pagination/pagi.model";
import { ToastrService } from "ngx-toastr";
import autoTable from "jspdf-autotable";
import { DamageModel } from "../../models/dashboard.model";
import jsPDF from "jspdf";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-damage-list',
  templateUrl: './damage-list.component.html',
  styleUrls: ['./damage-list.component.css'],
})
export class DamageListComponent implements OnInit {
  pagi: Pagi = new Pagi();
  filter: string;
  currency = '৳';
  dataList: DamageModel[] = [];
  sammary = {
    total_amount: 0.00,
    damage_date: '',
  }

  loader: boolean;
  loader_sub: boolean;
  damageList = [];
  damageDetails: any;
  damage: any;
  orderId: any;

  updateDamageItem: any = {
    item_id: 0,
    order_id: 0,
    item_name: '',
    company: '',
    new_quantity: '',
  };

  adminData = {
    email: '',
    password: '',
  };
  isAdmin = false;

  customLoader = true;
  showEmptyTable = false;

  constructor(
    private damageListService: DamageListService,
    private modalService: ModalService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.pagi.limit = this.pagi.limit ? this.pagi.limit : 100;
    this.pagi.page = this.pagi.page ? this.pagi.page : 1;
  }

  ngOnInit() {
    this.getPurcheseList();
  }

  getPurcheseList() {
    this.getDamageList(this.pagi.page, this.pagi.limit, this.filter);
  }
  reloadTable(e) {
    this.getDamageList(e.page, e.limit, e.filter);
  }
  filterList(e) {
    this.filter = e;
    this.getDamageList(1, 500, this.filter);
  }
  private setData(res) {
    this.pagi.total = res["total"] || 0;
    this.pagi.page = parseInt(res["page_no"]) || 1;
    this.pagi.limit = parseInt(res["limit"]) || 500;
  }
  getDamageList(p, l, q) {
    this.customLoader = true;
    this.damageListService.getPurcheseList(p, l, q)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          this.loader = false;
          return of([]);
        })
      )
      .subscribe((response) => {
        this.loader = false;
        this.damageList = response.data;
        this.customLoader = false;
        if (!response.total) {
          this.showEmptyTable = true;
        } else {
          this.showEmptyTable = false;
        }
        this.setData(response);
      });
  }

  openModal(orderId: number, modal: string) {
    console.log(this.orderId);
    $('.detail-' + this.orderId).removeClass('detail-order');
    $('.detail-' + orderId).addClass('detail-order');
    this.orderId = orderId;
    this.getDamageDetails(orderId, modal);
  }

  closeModal(id: string) {
    this.modalService.close(id);
    this.damageDetails = [];
    this.damage = [];
  }

  deleteDamageDetails(orderId) {
    Swal.fire({
      title: "Are you sure?",
      text: 'You won"t be able to revert this!',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.deleteDamage(orderId);
      }
    });
  }

  deleteDamage(orderId) {
    const data = { damage_id: orderId };

    this.damageListService.deleteDamageDetails(data)
      .then((response) => {
        if (response.status) {
          Swal.fire(
            "Damage details deleted successful!",
            "Successful!",
            "success"
          );
          this.getPurcheseList();
        } else {
          Swal.fire("Some Item already in list!", "Opps..!", "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getDamageDetails(orderId, modal=null) {
    this.damageListService.getPurcheseDetails(orderId).subscribe(
      (response) => {
        if (response.data) {
          this.damageDetails = response.data;
          this.damage = response.damage;

          if (modal) {
            $("#print-div").show();
            $("#close-div").show();
            this.modalService.open(modal);
          }
        } else {
          this.toastr.error("Error!");
        }
      }
    );
  }

  setDamageData() {
    this.dataList = this.damageDetails.map(row => ({
      item: row.medicine_name,
      quantity: row.quantity,
      price: row.price,
      amount: row.quantity * row.price
    }));

    this.sammary.total_amount = this.damage.total_amount;
    this.sammary.damage_date = this.damage.damage_date;
  }

  exportDamageReportPDF(): void {
    this.setDamageData()
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const formattedDate = this.datePipe.transform(
      this.sammary.damage_date,
      'medium',
      'Asia/Dhaka'
    );

    const title = `Damage List (${formattedDate})`;
    const logoImg = new Image();
    logoImg.src = 'assets/images/analyticalj.png'; // Ensure this is a small logo for best fit

    logoImg.onload = () => {
      const logoWidth = 20;
      const logoHeight = 10;
      const marginTop = 10;

      // Positioning
      const logoX = 14;
      const logoY = marginTop;

      const titleFontSize = 12;
      doc.setFontSize(titleFontSize);
      doc.setFont('helvetica', 'bold');

      const textWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - textWidth) / 2;
      const titleY = logoY + 7; // vertically center text with logo

      // Add logo and title in same row
      doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);
      doc.text(title, titleX, titleY);

      // Prepare table data
      const head = [['#', 'Item', 'Quantity', 'Price(৳)', 'Amount(৳)']];
      const body: any[] = this.dataList.map((item, index) => [
        index + 1,
        item.item,
        item.quantity,
        item.price.toLocaleString('en-BD', { minimumFractionDigits: 2 }),
        item.amount.toLocaleString('en-BD', { minimumFractionDigits: 2 }),
      ]);

      // Total row
      body.push([
        { content: 'Total', colSpan: 4, styles: { halign: 'center', fontStyle: 'bold' } },
        {
          content: this.sammary.total_amount.toLocaleString('en-BD', { minimumFractionDigits: 2 }),
          styles: { fontStyle: 'bold' }
        }
      ]);

      // Draw table just below the header
      autoTable(doc, {
        startY: logoY + logoHeight + 5, // compact top spacing
        head: head,
        body: body,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: 20,
          fontStyle: 'bold'
        },
        margin: { left: 14, right: 14 },
        didDrawPage: () => {
          // optional footer or watermark here
        }
      });

      doc.save('Damage_List.pdf');
    };
  }
}
