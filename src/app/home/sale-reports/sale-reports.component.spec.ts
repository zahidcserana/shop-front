import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReportsComponent } from './sale-reports.component';

describe('SaleReportsComponent', () => {
  let component: SaleReportsComponent;
  let fixture: ComponentFixture<SaleReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
