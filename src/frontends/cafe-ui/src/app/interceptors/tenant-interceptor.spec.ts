import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { tenantInterceptor } from './tenant-interceptor';

describe('tenantInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tenantInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('uses the QR tenant and sends no token for customers', () => {
    sessionStorage.setItem('tenantId', 'cafe-a');
    http.get('http://localhost:5110/api/menu').subscribe();

    const req = httpMock.expectOne('http://localhost:5110/api/menu');
    expect(req.request.headers.get('X-Tenant-ID')).toBe('cafe-a');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('adds the bearer token and login tenant for a logged-in admin', () => {
    localStorage.setItem('admin_token', 'abc');
    localStorage.setItem('tenantId', 'admin-cafe');
    sessionStorage.setItem('tenantId', 'cafe-a');
    http.get('http://localhost:5110/api/menu').subscribe();

    const req = httpMock.expectOne('http://localhost:5110/api/menu');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    expect(req.request.headers.get('X-Tenant-ID')).toBe('admin-cafe');
    req.flush([]);
  });

  it('falls back to demo-cafe when no tenant is known', () => {
    http.get('http://localhost:5110/api/menu').subscribe();

    const req = httpMock.expectOne('http://localhost:5110/api/menu');
    expect(req.request.headers.get('X-Tenant-ID')).toBe('demo-cafe');
    req.flush([]);
  });

  it('leaves requests to other hosts untouched', () => {
    localStorage.setItem('admin_token', 'abc');
    http.get('https://example.com/data').subscribe();

    const req = httpMock.expectOne('https://example.com/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(req.request.headers.has('X-Tenant-ID')).toBe(false);
    req.flush({});
  });
});
