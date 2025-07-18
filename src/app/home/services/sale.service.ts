import { Injectable } from "@angular/core";
import { HttpService } from "src/app/common/modules/http-with-injector/http.service";
import { map } from "rxjs/operators";

@Injectable()
export class SaleService {
  constructor(private http: HttpService) { }
  addtoCart(data: any) {
    return this.http.post("carts/add-to-cart", data).toPromise();
  }
  searchMedicineByPharmacy(search) {
    return this.http.get("medicines/search/sale", { params: search });
  }
  getBatchList(data: any) {
    return this.http.post(`medicines/batch`, data).pipe(map(res => res));
  }
  getAvailableQuantity(data: any) {
    return this.http.post(`medicines/quantity`, data).pipe(map(res => res));
  }
  saveCartsInlocalStorage(data) {
    localStorage.setItem("user_cart", JSON.stringify(data));
  }
  updateCart(data) {
    return this.http.post("carts/quantity-update", data).toPromise();
  }
  updateItemPrice(data) {
    return this.http.post("carts/price-update", data).toPromise();
  }
  checkCart(token: any) {
    return this.http.get(`carts/${token}/check`).pipe(map(res => res));
  }
  cartDetails(token: any) {
    return this.http.get(`carts/${token}`).pipe(map(res => res));
  }
  deleteCartItem(item_id, token) {
    return this.http.post('carts/delete-item', { token: token, item_id: item_id }).toPromise();
  }
  deleteCart(token) {
    return this.http.get(`carts/${token}/delete`).pipe(map(res => res));
  }
  makeSaleOrder(data: any) {
    return this.http.post('orders/sale', data).toPromise();
  }
  getSaleList(p, l, query?) {
    const params = query ? query : '';
    return this.http
      .get(`sales?page_no=${p ? p : 1}&limit=${l ? l : 20}${params}`)
      .pipe(map(res => res));
  }
  saleReport(p, l, query?) {
    const params = query ? query : '';
    return this.http
      .get(`sales/report?page_no=${p ? p : 1}&limit=${l ? l : 20}${params}`)
      .pipe(map(res => res));
  }
  dayWiseReport(query?) {
    const params = query ? query : '';
    return this.http
      .get(`sales/report-days?${params}`)
      .pipe(map(res => res));
  }
  saleDueList(p, l, query?) {
    const params = query ? query : '';
    return this.http
      .get(`sales/due?page_no=${p ? p : 1}&limit=${l ? l : 20}${params}`)
      .pipe(map(res => res));
  }
  returnItem(data) {
    return this.http.post('orders/sale/return-item', data).toPromise();
  }
  payoutAmount(data) {
    return this.http.post('sales/payout', data).toPromise();
  }
  giveDiscount(data) {
    return this.http.post('sales/discount', data).toPromise();
  }
  deleteItem(item_id) {
    return this.http.post('orders/sale/delete-item', { item_id: item_id }).toPromise();
  }
  
  getGenericList(data: any) {
    return this.http.post('inventory/generic/search', data).toPromise();
  }
}
