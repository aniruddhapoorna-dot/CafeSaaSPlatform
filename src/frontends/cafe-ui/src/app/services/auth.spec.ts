import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created and start logged out', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('stores the token on login and clears it on logout', () => {
    service.login({ username: 'admin', password: 'x', tenantId: 'demo-cafe' }).subscribe();

    httpMock.expectOne('http://localhost:5110/api/auth/login').flush({
      token: 'jwt-token',
      username: 'admin',
      tenantId: 'demo-cafe',
      role: 'Admin'
    });

    expect(service.isAuthenticated()).toBe(true);
    expect(localStorage.getItem('admin_token')).toBe('jwt-token');

    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('admin_token')).toBeNull();
  });
});
