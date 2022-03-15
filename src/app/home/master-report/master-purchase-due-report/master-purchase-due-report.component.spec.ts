import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPurchaseDueReportComponent } from './master-purchase-due-report.component';

describe('MasterPurchaseDueReportComponent', () => {
  let component: MasterPurchaseDueReportComponent;
  let fixture: ComponentFixture<MasterPurchaseDueReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPurchaseDueReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPurchaseDueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
