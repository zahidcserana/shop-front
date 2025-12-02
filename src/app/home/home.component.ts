import { Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from '../common/script-loader.service';
import { Helpers } from '../common/helpers';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  subscriptionOff: boolean = false;

  constructor(
    private _script: ScriptLoaderService, 
    private authService: AuthService
  ) {
    const loader = document.getElementById('loader');
    const myDiv = document.getElementById('myDiv');
    if (loader) loader.style.display = 'block';
    if (myDiv) myDiv.style.display = 'none';

    this.getSettings();
  }

  ngOnInit() {
    this.subscriptionOff = localStorage.getItem('subscriptionOvar') === 'true';
    
    setTimeout(() => this.showPage(), 3000);
    this.authService.checkSubscription();
  }

  showPage() {
    const loader = document.getElementById('loader');
    const myDiv = document.getElementById('myDiv');
    if (loader) loader.style.display = 'none';
    if (myDiv) myDiv.style.display = 'block';
  }

  getSettings() {
    Helpers.loadStyles('head', 'assets/css/bootstrap.min.css');
    Helpers.loadStyles('head', 'assets/css/custom.css');
    Helpers.loadStyles('head', 'assets/css/bs-datepicker.css');

    this._script.loadScripts('body', ['assets/js/main.js'])
      .then(result => {
        // Optional: Do something after scripts loaded
      });
  }
}
