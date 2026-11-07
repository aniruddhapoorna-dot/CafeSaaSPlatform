import { HttpInterceptorFn } from '@angular/common/http';

// TODO: move to an environment file when the API gets a hosted URL.
const API_BASE = 'http://localhost:5110';

/**
 * Adds the tenant header and, for a logged-in admin, the JWT bearer token.
 * Only requests to our own API are touched, so the token never leaks elsewhere.
 *
 * Tenant resolution:
 *  - logged-in admin  -> tenant saved at login (localStorage)
 *  - customer (QR)    -> tenant from the QR route (sessionStorage, per tab)
 *  - fallback         -> demo-cafe
 */
export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_BASE)) {
    return next(req);
  }

  const token = localStorage.getItem('admin_token');
  const tenantId =
    (token ? localStorage.getItem('tenantId') : null) ??
    sessionStorage.getItem('tenantId') ??
    'demo-cafe';

  const headers: Record<string, string> = { 'X-Tenant-ID': tenantId };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return next(req.clone({ setHeaders: headers }));
};
