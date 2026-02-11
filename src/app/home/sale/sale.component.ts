import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Observable } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  map,
  catchError,
} from "rxjs/operators";
import { SaleService } from "../services/sale.service";
import * as $ from "jquery";
import Swal from "sweetalert2";
import { HomeService } from "../services/home.service";
import { ModalService } from "src/app/common/_modal/modal.service";
import { ShortcutInput, ShortcutEventOutput } from "ng-keyboard-shortcuts";
import { Router } from "@angular/router";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { PrintService } from "../shared/services/print.service";
import { AppConfigService } from "src/app/services/app-config.service";
declare var require: any;

@Component({
  selector: "app-sale",
  templateUrl: "./sale.component.html",
  styleUrls: ["./sale.component.css"],
})
export class SaleComponent implements OnInit {
  activeSerialIndex: number | null = null;

  colorCodeLight = '#82929A';
  colorCodeSuper = '#c4d2da';
  colorCode = '#5F6F76';
  colorCodeText = '#ffff';
  currency = '৳';
  serialNo = ""
  emiAmount = 0

  cartItem: any = {
    medicine: "",
    medicine_id: "",
    quantity: "",
    serial_no: [],
    batch_no: "BAT-321",
    token: "",
    unit_type: "PCS",
  };
  users = [];
  paymentTypes = [];
  isAntibiotic = false;
  order: any = {
    token: "",
    sub_total: 0,
    tendered: "",
    created_by: 0,
    change: 0,
    total_due_amount: 0,
    total_advance_amount: 0,
    total_payble_amount: 0,
    discount: 0,
    discount_type: "fixed",
    discount_amount: 0,
    payment_type: "CASH",
    installments: 0,
    customer_name: "",
    customer_mobile: "",
    prescription_image: "",
    sendsms: false,
    is_delivery_order: false
  };
  searchData: any[] = [];
  loader_sub: boolean;
  medicineSearch: any = {
    search: "",
  };
  batchSearch = {
    medicine_id: "",
  };
  priceUpdate = {
    item_id: "",
    item_price: "",
  };
  availableQuantity = {
    medicine_id: "",
    batch_no:""
  };
  priceInWord = "";
  availability: number;
  searchList: any[];
  medicineList = [];
  batchList: any;
  productList: any;
  cartLoad: boolean;
  orderId: number;
  increament: any;
  incrementFreeQty: any;
  fileName: any;
  orderDetails: any;
  validationStatus: boolean;
  dueValidationStatus: boolean = false;
  @ViewChild("cartMedicine") Medicine: ElementRef;
  @ViewChild("cartQty") cartQty: ElementRef;
  @ViewChild("cartSerial") cartSerial: ElementRef;
  @ViewChild("modalButton") modalButton: ElementRef;
  @ViewChild("tendered") tendered: ElementRef;
  @ViewChild("installment") installment: ElementRef;
  @ViewChild("cartBatch") cartBatch: ElementRef;
  @ViewChild("customerName") customerName: ElementRef;
  @ViewChild('invoiceSection') invoiceSection!: ElementRef;
  @ViewChild('invoice2Section') invoice2Section!: ElementRef;
  company: any;
  salesmanShow = false;
  profitShow = false;
  tpShow = false;
  freeQtyShow = true;
  isCartEmpty = true;
  isSubmitting = false;
  invoiceVersion = 1;

  constructor(
    private homeService: HomeService,
    private modalService: ModalService,
    private saleService: SaleService,
    private router: Router,
    private printService: PrintService,
    public config: AppConfigService
  ) {
    this.config.loadFromStorage();
    const user = JSON.parse(localStorage.getItem("currentUser"));
    this.invoiceVersion = user.pos_version
  }

   printHandler(mode: 'a4' | 'pos'): void {
    if (this.invoiceVersion == 2) {
    this.printService.printInvoice2(mode, this.invoice2Section);
    } else {
      this.printService.printInvoice(mode, this.invoiceSection);
    }
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    this.salesmanShow = user.config.salesman_show;
    this.profitShow = user.config.profit_show;
    this.tpShow = user.config.tp_show;
    this.freeQtyShow = user.config.free_quantity_show;
    this.getUsers();
    this.getPaymentTypes();
    this.homeService.navigationTo();
    // this.getSaleDetails(this.orderId);
    const token = localStorage.getItem("token");
    this.cartItem.token = token ? token : "";
    if (this.cartItem.token !== "") {
      this.isCartEmpty = false;
      this.checkToken(this.cartItem.token);
    }
    this.Medicine.nativeElement.focus();
  }
  shortcuts: ShortcutInput[] = [];
  ngAfterViewInit() {
    this.Medicine.nativeElement.focus();

    this.shortcuts.push(
      {
        key: ["Shift + h"],
        label: "Help",
        description: "Report",
        command: (output: ShortcutEventOutput) =>
          this.printPosInvoice("pos-invoice-print"),
      },
      {
        key: ["Shift + q"],
        label: "Help",
        description: "Report",
        command: (output: ShortcutEventOutput) =>
          this.printPage("invoice-print"),
      },
      {
        key: ["Shift + n"],
        label: "Help",
        description: "Report",
        command: (output: ShortcutEventOutput) =>
          this.Medicine.nativeElement.focus(),
      }
    );
  }

  toggleSerial(index: number) {
    if (this.activeSerialIndex === index) {
      this.activeSerialIndex = null; // close
    } else {
      this.activeSerialIndex = index; // open
    }
  }

  onPaymentTypeChange(type: string) {
    this.order.tendered = 0;
    this.getChange()
    setTimeout(() => {
      this.installment.nativeElement.focus();
    }, 1000);
  }

  getPaymentTypes() {
    this.homeService.allPaymentTypes().subscribe((res) => {
      this.paymentTypes = res;
      this.order.payment_type = res[0].name
    });
  }
  getUsers() {
    this.homeService.allUser().subscribe((res) => {
      this.users = res;
    });
  }
  checkToken(token) {
    this.saleService.checkCart(this.cartItem.token).subscribe((res) => {
      if (res.status === true) {
        this.saleService.cartDetails(this.cartItem.token).subscribe((data) => {
          this.productList = data;
          this.fileName = data.file_name;
          // console.log(this.productList.file_name);
          this.isAntibiotic = data.is_antibiotic;
          this.setValue();
        });
      } else {
        localStorage.removeItem("user_cart");
        localStorage.removeItem("token");
        this.productList = [];
      }
    });
  }
  /** Start Medicine search */
  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchData = [];
        this.loader_sub = true;
      }),
      switchMap((term) => {
        this.medicineSearch.search = term;
        if (this.medicineSearch.search.length > 1) {
          return this.getMedicineList(this.medicineSearch);
        }
        return [];
      })
    );
  };

  @ViewChild("typeaheadInstance")
  private typeaheadInstance: NgbTypeahead;
  typeaheadKeydown($event: KeyboardEvent) {
    if (this.typeaheadInstance.isPopupOpen()) {
      setTimeout(() => {
        const popup = document.getElementById(this.typeaheadInstance.popupId);
        const activeElements = popup.getElementsByClassName("active");
        if (activeElements.length === 1) {
          // activeElements[0].scrollIntoView();
          const elem = activeElements[0] as any;
          if (typeof elem.scrollIntoViewIfNeeded === "function") {
            // non standard function, but works (in chrome)...
            elem.scrollIntoViewIfNeeded();
          } else {
            //do custom scroll calculation or use jQuery Plugin or ...
            this.scrollIntoViewIfNeededPolyfill(elem as HTMLElement);
          }
        }
      });
    }
  }
  private scrollIntoViewIfNeededPolyfill(
    elem: HTMLElement,
    centerIfNeeded = true
  ) {
    let parent = elem.parentElement,
      parentComputedStyle = window.getComputedStyle(parent, null),
      parentBorderTopWidth = parseInt(
        parentComputedStyle.getPropertyValue("border-top-width")
      ),
      parentBorderLeftWidth = parseInt(
        parentComputedStyle.getPropertyValue("border-left-width")
      ),
      overTop = elem.offsetTop - parent.offsetTop < parent.scrollTop,
      overBottom =
        elem.offsetTop -
        parent.offsetTop +
        elem.clientHeight -
        parentBorderTopWidth >
        parent.scrollTop + parent.clientHeight,
      overLeft = elem.offsetLeft - parent.offsetLeft < parent.scrollLeft,
      overRight =
        elem.offsetLeft -
        parent.offsetLeft +
        elem.clientWidth -
        parentBorderLeftWidth >
        parent.scrollLeft + parent.clientWidth,
      alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop =
        elem.offsetTop -
        parent.offsetTop -
        parent.clientHeight / 2 -
        parentBorderTopWidth +
        elem.clientHeight / 2;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft =
        elem.offsetLeft -
        parent.offsetLeft -
        parent.clientWidth / 2 -
        parentBorderLeftWidth +
        elem.clientWidth / 2;
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      elem.scrollIntoView(alignWithTop);
    }
  }
  /** End Medicine search */

  getMedicineList(params): any {
    if (!params && params === "") {
      this.loader_sub = false;
      return [];
    }
    return this.saleService.searchMedicineByPharmacy(params).pipe(
      map((res) => {
        this.medicineList = [];
        this.loader_sub = false;
        this.searchData = res;
        if (this.searchData.length === 1) {
          for (let medicine of res) {
            this.medicineList.push(medicine.name);
            this.cartItem.medicine = medicine.name;
            this.cartItem.medicine_id = medicine.id;
            this.cartBatch.nativeElement.focus();
          }
        } else {
          for (let medicine of res) {
            let medicine_name = this.config.enBatch ? medicine.name + ' #' + medicine.batch_no: medicine.name
            this.medicineList.push(medicine_name);
          }
        }
        return this.medicineList;
      }),
      catchError(() => {
        this.loader_sub = false;
        return [];
      })
    );
  }

  getCustomerByCode(): void {
    const mobile = this.order.customer_mobile;

    if (!mobile || mobile.trim() === '') {
      return;
    }

    this.saleService.getCustomerByCode({ customer_code: mobile })
      .subscribe({
        next: (response) => {
          this.order.customer_name = response.name;
          this.customerName.nativeElement.focus();
        },
        error: (err) => {
          console.error("Error fetching customer", err);
        }
      });
  }

  getNet() {
    this.order.total_payble_amount = this.order.sub_total
      ? this.order.sub_total - this.order.discount
      : 0;
    if (this.order.discount > this.order.total_payble_amount) {
      this.order.total_payble_amount = 0;
    }
    this.order.tendered = this.order.total_payble_amount;
  }
  discountChange() {
    this.calculateDiscount(this.order.discount_type);
    this.getNet();
    this.getChange();
  }
  discountTypeChange(type = null) {
    this.order.discount_type = type;
    if (type == "fixed") {
      $("#dicountValue").hide();
    } else {
      $("#dicountValue").show();
    }
    this.calculateDiscount(this.order.discount_type);
    this.getNet();
    this.getChange();
  }
  getChange() {
    console.log(this.order.discount);
    this.order.change = this.checkIsLessZero(
      this.order.tendered
        ? this.order.tendered - this.order.total_payble_amount
        : 0
    );
    this.order.total_due_amount = this.checkIsLessZero(
      this.order.tendered
        ? this.order.total_payble_amount - this.order.tendered
        : this.order.total_payble_amount
    );
    if (this.order.total_due_amount == 0) {
      this.order.total_advance_amount = this.order.total_payble_amount;
      $(".tr-change").addClass("tdChange");
      $(".tr-due").removeClass("tdDue");
    } else {
      this.order.total_advance_amount = this.order.tendered;
      $(".tr-due").addClass("tdDue");
      $(".tr-change").removeClass("tdChange");
    }
  }

  getEmiAmount() {
    this.emiAmount = this.order.total_due_amount / this.order.installments
  }

  checkIsLessZero(value) {
    return value < 0 ? 0 : value;
  }
  goQty() {
    this.cartItem.serial_no = []
    this.getAvailableQuantity();
    if (this.cartItem.medicine) {
      if (this.config.enSerialNo) {
        this.cartSerial.nativeElement.focus();
      } else {
        this.cartQty.nativeElement.focus();
      }
    }
  }
  goTendered() {
    this.tendered.nativeElement.focus();
  }
  setValue() {
    this.order.sub_total = this.productList ? this.productList.sub_total : 0;
    this.order.total_payble_amount = this.productList
      ? this.productList.sub_total - this.productList.discount
      : 0;
    this.order.tendered = this.order.total_payble_amount;
  }

  checkingAvailability() {
    if (this.availability === null) {
      return false;
    }
    if (this.availability >= this.cartItem.quantity) {
      return true;
    }
  }

  getPriceInWord(value: number) {
    const converter = require("number-to-words");
    let words = converter.toWords(value);

    // Capitalize each word
    words = words
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    this.priceInWord = `${words} Taka Only`;
  }

  addToCart() {
    this.orderId = 0;
    if (this.cartItem.medicine && this.cartItem.quantity) {
      if (this.checkingAvailability()) {
        // this.getMedicineId();
        const token = localStorage.getItem("token");
        this.cartItem.token = token ? token : "";
        this.saleService
          .addtoCart(this.cartItem)
          .then((res) => {
            if (res.success === true) {
              this.isCartEmpty = false;
              this.saleService.saveCartsInlocalStorage(res.data);
              localStorage.setItem("token", res.data.token);
              this.productList = res.data;
              this.isAntibiotic = res.data.is_antibiotic;
              this.setValue();
              this.cartLoad = false;
              this.availability = null;
              this.batchList = [];
              $("#myForm").trigger("reset");
              this.orderId = 0;
              this.cartItem.serial_no = []
              this.cartItem.medicine = ''
              this.Medicine.nativeElement.focus();
              if (this.isAntibiotic) {
                Swal.fire({
                  position: "center",
                  type: "warning",
                  title:
                    "Anti-Biotic Medicine Alart! Please Upload The Prescription Image.",
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
            } else {
              Swal.fire({
                type: "warning",
                title: "Oops...",
                text: res.error,
                showConfirmButton: false,
              });
            }
          })
          .catch((err) => {
            this.cartLoad = false;
            Swal.fire({
              type: "warning",
              title: "Oops...",
              text: "Something went wrong!",
              showConfirmButton: false,
            });
          });
      } else {
        let str = "Only " + this.availability + " Pcs is available";

        if (this.availability === null) {
          str = "Empty stock";
        }
        Swal.fire({
          type: "warning",
          title: "Oops...",
          text: str,
          showConfirmButton: false,
        });
      }
    } else {
      Swal.fire({
        type: "warning",
        title: "Oops...",
        text: "Please, select medicine and enter quantity!",
        showConfirmButton: false,
      });
    }
  }
  trackList(index, pro) {
    return pro ? pro.id : null;
  }
  getBatch() {
    for (let s of this.searchData) {
      if (s.name == this.cartItem.medicine) {
        this.cartItem.medicine_id = s.id;
      }
    }
    this.batchSearch.medicine_id = this.cartItem.medicine_id;
    this.saleService
      .getBatchList(this.batchSearch)
      .subscribe((data) => (this.batchList = data));
  }

  addSerial() {
    if (this.serialNo === "") return
    this.cartItem.serial_no.push(this.serialNo) 
    this.cartItem.quantity++
    this.serialNo = ""
  }

  getAvailableQuantity() {
    this.getMedicineId();
    this.checkQuantity();
  }
  checkQuantity() {
    if (this.cartItem.medicine_id > 0) {
      this.availableQuantity.medicine_id = this.cartItem.medicine_id;
      this.availableQuantity.batch_no = this.cartItem.batch_no;
      this.saleService
        .getAvailableQuantity(this.availableQuantity)
        .subscribe(
          (data) =>
          (this.availability = data.available_quantity
            ? data.available_quantity
            : null)
        );
    } else {
      this.availability = null;
    }
  }

  getMedicineId() {
    if (this.cartItem.medicine === '' || this.cartItem.medicine === undefined) return
    let cartProduct = this.cartItem.medicine.split('#')
    if (cartProduct.length > 1) {
      this.cartItem.batch_no = cartProduct[1]
    }

    for (let s of this.searchData) {
      if (s.name == cartProduct[0].trim()) {
        this.cartItem.medicine_id = s.id;
        this.company = s.company;
      }
    }
  }

  calculation() {
    this.calculateDiscount(this.order.discount_type);
    this.getNet();
    this.getChange();
  }

  updateItemPrice(cart, i) {
    this.priceUpdate.item_id = cart.id;
    this.priceUpdate.item_price = $("#unit_price_" + i).val();

    if (this.priceUpdate.item_price < cart.tp) {
      return Swal.fire({
            type: "warning",
            title: "Oops...",
            text: "RPU should be greater than CPU",
            showConfirmButton: false,
          });
    }

    this.saleService
      .updateItemPrice(this.priceUpdate)
      .then((res) => {
        if (res.success === true) {
          this.productList = res.data;
          this.isAntibiotic = res.data.is_antibiotic;
          this.setValue();
          // this.order.sub_total = this.productList ? this.productList.sub_total : 0;
          this.calculation();
          this.saleService.saveCartsInlocalStorage(res.data);
        } else {
          console.log(res);
        }
        this.increament = null;
      })
      .catch((err) => {
        console.log(err);
        this.increament = null;
      });
  }

  decreaseQuant(cart, i) {
    if (cart.quantity > 1) {
      this.increament = i;
      const obj = {
        id: cart.id,
        token: this.productList.token,
        sales_tax: cart.sales_tax,
        increment: 0,
        price: cart.price,
        rental_duration: cart.rental_duration,
      };
      this.updateCartQunt(obj);
    }
  }

  decreaseFreeQty(cart, i) {
    if (cart.free_quantity > 0) {
      this.incrementFreeQty = i;
      const obj = {
        id: cart.id,
        token: this.productList.token,
        sales_tax: cart.sales_tax,
        increment_free: 0,
        price: cart.price,
        rental_duration: cart.rental_duration,
      };
      this.updateCartFreeQty(obj);
    }
  }
  removeItem(itemId) {
    this.saleService
      .deleteCartItem(itemId, localStorage.getItem("token"))
      .then((res) => {
        if (res.success === true) {
          this.saleService.saveCartsInlocalStorage(res.data);
          localStorage.setItem("token", res.data.token);
          this.productList = res.data;
          this.isAntibiotic = res.data.is_antibiotic;
          this.setValue();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  removeCart() {
    this.saleService
      .deleteCart(localStorage.getItem("token"))
      .subscribe((res) => {
        if (res.status === true) {
          Swal.fire({
            position: "center",
            type: "success",
            title: "Done",
            showConfirmButton: false,
            timer: 1500,
          });
          this.reset();
        }
      });
  }
  reset() {
    this.isCartEmpty = true;

    localStorage.removeItem("user_cart");
    localStorage.removeItem("token");

    this.productList = [];
    this.order.sub_total = 0;
    this.order.tendered = 0;
    this.order.change = 0;
    this.order.total_due_amount = 0;
    this.order.total_advance_amount = 0;
    this.order.total_payble_amount = 0;
    this.order.discount = 0;
    this.order.customer_name = "";
    this.order.customer_mobile = "";
    this.order.discount_amount = 0;
  }

  increaseQuant(cart, i) {
    this.increament = i;
    const obj = {
      id: cart.id,
      token: this.productList.token,
      increment: 1,
    };
    this.updateCartQunt(obj);
  }

  increaseFreeQty(cart, i) {
    console.log('i', i)
    this.incrementFreeQty = i;
    const obj = {
      id: cart.id,
      token: this.productList.token,
      increment_free: 1,
    };
    this.updateCartFreeQty(obj);
  }

  updateCartQunt(data) {
    console.log(data);
    this.saleService
      .updateCart(data)
      .then((res) => {
        if (res.success === true) {
          this.productList = res.data;
          this.isAntibiotic = res.data.is_antibiotic;
          // this.order.sub_total = this.productList ? this.productList.sub_total : 0;
          this.setValue();
          this.calculation();
          this.saleService.saveCartsInlocalStorage(res.data);
        } else {
          Swal.fire({
            type: "warning",
            title: "Oops...",
            text: res.error,
            showConfirmButton: false,
          });
        }
        this.increament = null;
        this.incrementFreeQty = null;
      })
      .catch((err) => {
        console.log(err);
        this.increament = null;
        this.incrementFreeQty = null;
      });
  }

  updateCartFreeQty(data) {
    console.log(data);
    this.saleService
      .updateFreeQty(data)
      .then((res) => {
        if (res.success === true) {
          this.productList = res.data;
          // this.isAntibiotic = res.data.is_antibiotic;
          // // this.order.sub_total = this.productList ? this.productList.sub_total : 0;
          // this.setValue();
          // this.calculation();
          this.saleService.saveCartsInlocalStorage(res.data);
        } else {
          Swal.fire({
            type: "warning",
            title: "Oops...",
            text: res.error,
            showConfirmButton: false,
          });
        }
        this.increament = null;
        this.incrementFreeQty = null;
      })
      .catch((err) => {
        console.log(err);
        this.increament = null;
        this.incrementFreeQty = null;
      });
  }

  calculateDiscount(type) {
    if (type == "fixed") {
      this.order.discount = this.order.discount_amount;
    } else {
      this.order.discount =
        (this.order.sub_total / 100) * this.order.discount_amount;
    }
  }
  validationCheck() {
    this.validationStatus = true;
    // if (!this.order.tendered) {
    //   this.validationStatus = false;
    //   $("#tendered").addClass("invalid-input");
    // }

    if (this.order.total_due_amount) {
      this.dueValidationStatus = false;
      if (!this.order.customer_mobile) {
        this.dueValidationStatus = true;
        $("#customer_mobile").addClass("invalid-input");
      }
    }

    return this.validationStatus;
  }

  submitOrder() {
    if (this.isSubmitting) return; // Prevent double click
    this.isSubmitting = true;
    this.validationCheck()

    if (!this.validationStatus) {
      this.isSubmitting = false;
      
      return Swal.fire({
        type: "warning",
        title: "Oops...",
        text: "Please enter all required field!",
        showConfirmButton: false,
      });
    }

    if (this.dueValidationStatus) {
      this.dueValidationStatus = false
      this.isSubmitting = false;

      return Swal.fire({
        type: "warning",
        title: "Oops...",
        text: "Mobile number is required for due Sale!",
        showConfirmButton: false,
      });
    }

    if (!this.productList || !this.productList.cart_items || this.productList.cart_items.length < 1) {
      this.isSubmitting = false;

      return Swal.fire({
        type: "warning",
        title: "Oops...",
        text: "Empty cart!",
        showConfirmButton: false,
      });
    }


  this.order.token = localStorage.getItem("token");

  if (this.config.enDeliveryOrder) {
    this.order.is_delivery_order = this.config.enDeliveryOrder
  }
  
  this.saleService
    .makeSaleOrder(this.order)
    .then((res) => {
      if (res.success) {
        this.reset();

        this.orderId = res.data.order_id;
        this.orderDetails = res.data;
        this.getPriceInWord(this.orderDetails.total_payble_amount);

        this.fileName = "";
        $(".validation-input").removeClass("invalid-input");
        Swal.fire({
          position: "center",
          type: "success",
          title: "Orders successfully submitted.",
          showConfirmButton: false,
          timer: 1500,
        });
        // setTimeout(() => { this.reset(); }, 3000);
        // this.Medicine.nativeElement.focus();
        // setTimeout(() => { this.modalButton.nativeElement.focus(); }, 1000);
      } else {
          Swal.fire({
          type: "warning",
          title: "Oops...",
          text: "Something went wrong!",
          showConfirmButton: false,
        })
      }
      this.isSubmitting = false;
      this.reset();
    })
    .catch((err) => {
      console.log(err);
      Swal.fire({
        type: "warning",
        title: "Oops...",
        text: "Something went wrong!",
        showConfirmButton: false,
      })
      .finally(() => {
        // ✅ Re-enable the button only after everything completes
        this.isSubmitting = false;
      });
    });
  }

  /* modal */
  openModal(saleId: number, modal: string) {
    $("#print-div").show();
    $("#close-div").show();
    this.getSaleDetails(saleId);
    this.modalService.open(modal);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

  printInvoiceOld(printArea) {
    $('.print-div').hide();
    $("#print-div").hide();
    $("#close-div").hide();

    var divToPrint = document.getElementById(printArea);
    var strHead = "<html>\n<head><style>";
    strHead += "#invoice-POS{box-shadow:0 0 1in -.25in rgba(0,0,0,.5);padding:2mm;margin:0 auto;width:44mm;background:#fff}::selection{background:#f31544;color:#fff}::moz-selection{background:#f31544;color:#fff}h1{font-size:1.5em;color:#222}h2{font-size:.9em}h3{font-size:1.2em;font-weight:300;line-height:2em}p{font-size:.7em;color:#666;line-height:1.2em}#bot,#mid,#top{border-bottom:1px solid #eee}#top{min-height:100px}#mid{min-height:80px}#bot{min-height:50px}#top .logo{float:left;height:60px;width:60px;background:url(http://michaeltruong.ca/images/logo1.png) no-repeat;background-size:60px 60px}.clientlogo{float:left;height:60px;width:60px;background:url(http://michaeltruong.ca/images/client.jpg) no-repeat;background-size:60px 60px;border-radius:50px}.info{display:block;float:left;margin-left:0}.title{float:right}.title p{text-align:right}table{width:100%;border-collapse:collapse}table, table th, table td {border: 1px solid black !important; border-collapse: collapse !important;}table th, table td {padding: 5px !important;}tfoot td, tfoot th {border: none !important;}.tabletitle{padding:5px;font-size:.5em;background:#eee}.service{border-bottom:1px solid #eee}.item{width:24mm}.itemtext{font-size:.5em}#legalcopy{margin-top:5mm}";
    strHead +=
      '</style>\n <link rel="stylesheet" type="text/css"  href="/assets/css/bootstrap.min.css">\n <link rel="stylesheet" type="text/css"  href="/css/agent_style.css">\n <link rel="stylesheet" type="text/css"  href="/afcview/dist/css/AdminLTE.css">\n<style>#invoice_modal_id{font-size: 10px;}#invoice_modal_id td{padding: 2px;}</style></head><body style="font-size: 10px;"><div><center>\n' +
      divToPrint.innerHTML +
      "\n</center></div>\n</body>\n</html>";

    var w = window.open();
    $(w.document.body).html(strHead);
    w.print();
    window.location.reload();
  }
  printPosInvoice(printArea) {
    // this.modalService.close('print-modal-pos');
    var divToPrint = document.getElementById(printArea);
    var strHead =
      "<html>\n<head><style>@page { size: 0in; }</style><body style='font-size: 8px!important;text-align: center;'>";
    strHead += divToPrint.innerHTML + "\n</center></div>\n</body>\n</html>";

    // var originalContents = document.body.innerHTML;

    // document.body.innerHTML = strHead;
    var w = window.open();
    $(w.document.body).html(strHead);
    w.print();
    // document.body.innerHTML = originalContents;
    window.location.reload();
  }

  printPage(divId) {
    var printContents = document.getElementById(divId).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  }
  getSaleDetails(saleId) {
    this.homeService
      .saleDetails(saleId)
      .subscribe((data) => (this.orderDetails = data));
  }
}
