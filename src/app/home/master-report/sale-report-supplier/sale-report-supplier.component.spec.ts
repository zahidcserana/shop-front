import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportSupplierComponent } from './sale-report-supplier.component';

describe('SaleReportSupplierComponent', () => {
  let component: SaleReportSupplierComponent;
  let fixture: ComponentFixture<SaleReportSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleReportSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReportSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
