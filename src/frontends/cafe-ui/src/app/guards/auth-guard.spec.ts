import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, provideRouter } from '@angular/router';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient()]
    });
  });

  it('blocks and redirects to login when there is no token', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    expect(executeGuard(route, state)).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/admin/login']);
  });

  it('allows access when a token exists', () => {
    localStorage.setItem('admin_token', 'abc');
    expect(executeGuard(route, state)).toBe(true);
  });
});
