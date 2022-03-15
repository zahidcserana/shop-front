import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements AfterViewInit {
  className: string;
  message: any;
  @ViewChild('alert') foo: ElementRef;

  constructor() {
  }

  ngAfterViewInit() {

  }

}
