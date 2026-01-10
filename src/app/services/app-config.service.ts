import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  enBatch: boolean = false;

  loadFromStorage() {
    const userStr = localStorage.getItem('currentUser');

    if (userStr) {
      const user = JSON.parse(userStr);

      if (user && user.config && user.config.en_batch) {
        this.enBatch = true;
      } else {
        this.enBatch = false;
      }
    }
  }
}
