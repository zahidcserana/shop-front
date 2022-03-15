import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleFilterComponent } from './sale-filter.component';

describe('SaleFilterComponent', () => {
  let component: SaleFilterComponent;
  let fixture: ComponentFixture<SaleFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
