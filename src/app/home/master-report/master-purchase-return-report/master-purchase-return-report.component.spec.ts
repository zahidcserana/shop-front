import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPurchaseReturnReportComponent } from './master-purchase-return-report.component';

describe('MasterPurchaseReturnReportComponent', () => {
  let component: MasterPurchaseReturnReportComponent;
  let fixture: ComponentFixture<MasterPurchaseReturnReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPurchaseReturnReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterPurchaseReturnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
