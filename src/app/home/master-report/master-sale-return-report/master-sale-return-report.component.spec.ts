import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSaleReturnReportComponent } from './master-sale-return-report.component';

describe('MasterSaleReturnReportComponent', () => {
  let component: MasterSaleReturnReportComponent;
  let fixture: ComponentFixture<MasterSaleReturnReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSaleReturnReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSaleReturnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
