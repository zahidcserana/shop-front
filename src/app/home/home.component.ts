import { HomeService } from 'src/app/home/services/home.service';
import { Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from '../common/script-loader.service';
import { Helpers } from '../common/helpers';
import * as $ from 'jquery';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  subscriptionOff: boolean;
  constructor(private _script: ScriptLoaderService, private authService: AuthService, private homeService: HomeService) {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('myDiv').style.display = 'none';
    this.getSettings();
  }

  ngOnInit() {
    if(localStorage.getItem('subscriptionOvar') === 'true') {
      this.subscriptionOff = true;
    }
    setTimeout(this.showPage, 3000);
    this.authService.checkSubscription();
  }

  showPage() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('myDiv').style.display = 'block';
  }
  getSettings() {
    Helpers.loadStyles('head', 'assets/css/bootstrap.min.css');
    Helpers.loadStyles('head', 'assets/css/custom.css');
    Helpers.loadStyles('head', 'assets/css/bs-datepicker.css');

    this._script.loadScripts('body', [
      'assets/js/main.js',
    ])
      .then(result => {
        // Helpers.setLoading(false);
      });
  }
}
