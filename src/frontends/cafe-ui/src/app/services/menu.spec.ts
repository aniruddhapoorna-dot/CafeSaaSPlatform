import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MenuService } from './menu';

describe('MenuService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(MenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads menu items from the API', () => {
    let result: unknown;
    service.getMenuItems().subscribe((items) => (result = items));

    const req = httpMock.expectOne('http://localhost:5110/api/menu');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Latte', description: '', price: 150, category: 'Coffee' }]);

    expect(result).toEqual([
      { id: 1, name: 'Latte', description: '', price: 150, category: 'Coffee' }
    ]);
  });
});
