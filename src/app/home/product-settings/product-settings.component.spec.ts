import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSettingsComponent } from './product-settings.component';

describe('ProductSettingsComponent', () => {
  let component: ProductSettingsComponent;
  let fixture: ComponentFixture<ProductSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
