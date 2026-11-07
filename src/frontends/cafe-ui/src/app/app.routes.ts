import { Routes } from '@angular/router';
import { CustomerLanding } from './pages/customer-landing/customer-landing';
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'cafe/:tenantId/table/:tableId', component: CustomerLanding },
  { path: 'admin/login', component: AdminLogin },
  { 
    path: 'admin/dashboard', 
    component: AdminDashboard, 
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: 'cafe/demo-cafe/table/1', pathMatch: 'full' },
  { path: '**', redirectTo: 'cafe/demo-cafe/table/1' }
];