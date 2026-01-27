import { Component, HostListener } from '@angular/core';
import { ScriptLoaderService } from './common/script-loader.service';
import { HomeService } from './home/services/home.service'
import { Router } from '@angular/router';
import { ShortcutInput, ShortcutEventOutput } from 'ng-keyboard-shortcuts';
import { interval, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfigService } from './services/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AnalyticalJ';
  constructor(
    private _script: ScriptLoaderService,
    private MainHomeService: HomeService,
    private router: Router,
    private config: AppConfigService
  ) {
    this.getSettings();
    this.config.loadFromStorage();
  }
  ngOnInit() {
    this.MainHomeService.navigationTo();
    this.generateAndCheckNotification();
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    // event.preventDefault();
  }

  shortcuts: ShortcutInput[] = [];

  ngAfterViewInit() {
    this.shortcuts.push(
      {
        key: ["Shift + d"],
        label: "Sale",
        description: "Shift + d",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/'])
      },
      {
        key: ["Shift + r"],
        label: "Help",
        description: "Report",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/report/sale'])
      },
      {
        key: ["Shift + s"],
        label: "Sale",
        description: "Shift + s",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/sale'])
      },
      {
        key: ["Shift + l"],
        label: "Sale List",
        description: "Shift + l",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/sale/list'])
      },
      {
        key: ["Shift + j"],
        label: "Sale Due",
        description: "Shift + j",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/sale-due'])
      },
      {
        key: ["Shift + p"],
        label: "Purchase",
        description: "Shift + p",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/purchase'])
      },
      {
        key: ["Shift + o"],
        label: "Purchase List",
        description: "Shift + o",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/purchase-list'])
      },
      {
        key: ["Shift + k"],
        label: "Purchase Due",
        description: "Shift + k",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/purchase-due'])
      },
      {
        key: ["Shift + t"],
        label: "Purchase Report",
        description: "Shift + t",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/report/purchase'])
      },
      {
        key: ["Shift + u"],
        label: "User",
        description: "Shift + u",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/user'])
      },
      {
        key: ["Shift + i"],
        label: "Inventory",
        description: "Shift + i",
        command: (output: ShortcutEventOutput) =>
          this.router.navigate(['/inventory'])
      }
    );
  }

  generateAndCheckNotification() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    console.log(dateTime);
    interval(60 * 60 * 1000).subscribe(x => {
      this.generateAndCheckNotification();
      this.generateNotifications();
    });
  }

  generateNotifications() {
    console.log('Generate Notification')
    this.MainHomeService.generateLowStockNotification()
      .then(response => { })
      .catch(err => {
        console.log(err)
      });
  }

  getSettings() {
    // Helpers.loadStyles('head', 'assets/css/bootstrap.min.css');

    this._script.loadScripts('body', [
      // 'assets/js/bootstrap.min.js',
    ])
      .then(result => {
        // Helpers.setLoading(false);
      });
  }
}
