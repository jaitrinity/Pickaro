import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerReportComponent } from './partner-report.component';

describe('PartnerReportComponent', () => {
  let component: PartnerReportComponent;
  let fixture: ComponentFixture<PartnerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
