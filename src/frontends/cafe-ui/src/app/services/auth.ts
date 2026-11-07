import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  username: string;
  tenantId: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5110/api/auth';
  
  currentUser = signal<string | null>(localStorage.getItem('admin_user'));
  token = signal<string | null>(localStorage.getItem('admin_token'));

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string; tenantId?: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_user', res.username);
        if (res.tenantId) {
          localStorage.setItem('tenantId', res.tenantId);
        }
        this.token.set(res.token);
        this.currentUser.set(res.username);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this.token.set(null);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }
}