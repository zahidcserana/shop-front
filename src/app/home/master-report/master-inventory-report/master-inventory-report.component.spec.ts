import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterInventoryReportComponent } from './master-inventory-report.component';

describe('MasterInventoryReportComponent', () => {
  let component: MasterInventoryReportComponent;
  let fixture: ComponentFixture<MasterInventoryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterInventoryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterInventoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
