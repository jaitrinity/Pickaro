import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryboysComponent } from './deliveryboys.component';

describe('DeliveryboysComponent', () => {
  let component: DeliveryboysComponent;
  let fixture: ComponentFixture<DeliveryboysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryboysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryboysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
