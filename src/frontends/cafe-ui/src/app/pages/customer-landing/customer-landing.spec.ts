import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { CustomerLanding } from './customer-landing';

describe('CustomerLanding', () => {
  let component: CustomerLanding;
  let fixture: ComponentFixture<CustomerLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerLanding],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerLanding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
