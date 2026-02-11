import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  enBatch: boolean = false;
  enSerialNo: boolean = false;
  enTP: boolean = false;
  enEMI: boolean = false;
  enDeliveryOrder: boolean = false;
  logoUrl: string = '';

  loadFromStorage() {
    const userStr = localStorage.getItem('currentUser');

    if (userStr) {
      const user = JSON.parse(userStr);
      const logoPath = user.logo;
      this.logoUrl = logoPath ? logoPath : 'assets/images/logo3.png';

      if (user && user.config) {
        this.enBatch = !!user.config.en_batch;
        this.enSerialNo = !!user.config.en_serial_no;
        this.enTP = !!user.config.en_tp;
        this.enEMI = !!user.config.en_emi;
        this.enDeliveryOrder = !!user.config.en_delivery_order;
      } else {
        this.enBatch = false;
        this.enSerialNo = false;
        this.enTP = false;
        this.enEMI = false;
        this.enDeliveryOrder = false;
      }
    }
  }
}
