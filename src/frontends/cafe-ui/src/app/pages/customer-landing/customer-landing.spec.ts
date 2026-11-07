import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLanding } from './customer-landing';

describe('CustomerLanding', () => {
  let component: CustomerLanding;
  let fixture: ComponentFixture<CustomerLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerLanding],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerLanding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
