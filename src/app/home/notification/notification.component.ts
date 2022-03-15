import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service'
import { TestBed } from '@angular/core/testing';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(private NotificationService: NotificationService) { }

  ngOnInit() {
    this.getNotificationList();
  }

  loader: boolean;
  searchData: any[] = [];
  loader_sub: boolean;
  notificationList: any[] = [];

  TestNotification(){
    console.log('no-args');
  }

  getNotificationList(){
    this.NotificationService.getNotificationList().pipe(map(response => {
      return response;
    }), catchError(err => {
      this.loader = false;
      return of([]);
    })).subscribe(response => {
      this.loader = false;
      this.notificationList = response.data;
    });
  }

}
