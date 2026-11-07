import { HttpInterceptorFn } from '@angular/common/http';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantId = sessionStorage.getItem('tenantId') || 'friend-cafe';

  const clonedRequest = req.clone({
    setHeaders: {
      'X-Tenant-ID': tenantId
    }
  });

  return next(clonedRequest);
};