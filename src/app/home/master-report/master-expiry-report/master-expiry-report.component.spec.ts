import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterExpiryReportComponent } from './master-expiry-report.component';

describe('MasterExpiryReportComponent', () => {
  let component: MasterExpiryReportComponent;
  let fixture: ComponentFixture<MasterExpiryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterExpiryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterExpiryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
