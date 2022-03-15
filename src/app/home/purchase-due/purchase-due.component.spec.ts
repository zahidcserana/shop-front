import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDueComponent } from './purchase-due.component';

describe('PurchaseDueComponent', () => {
  let component: PurchaseDueComponent;
  let fixture: ComponentFixture<PurchaseDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
