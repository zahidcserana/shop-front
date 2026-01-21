import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  enBatch: boolean = false;
  enSerialNo: boolean = false;
  enTP: boolean = false;

  loadFromStorage() {
    const userStr = localStorage.getItem('currentUser');

    if (userStr) {
      const user = JSON.parse(userStr);

      if (user && user.config) {
        this.enBatch = !!user.config.en_batch;
        this.enSerialNo = !!user.config.en_serial_no;
        this.enTP = !!user.config.en_tp;
      } else {
        this.enBatch = false;
        this.enSerialNo = false;
        this.enTP = false;
      }
    }
  }
}
