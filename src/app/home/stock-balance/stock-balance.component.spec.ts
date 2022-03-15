import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBalanceComponent } from './stock-balance.component';

describe('StockBalanceComponent', () => {
  let component: StockBalanceComponent;
  let fixture: ComponentFixture<StockBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
