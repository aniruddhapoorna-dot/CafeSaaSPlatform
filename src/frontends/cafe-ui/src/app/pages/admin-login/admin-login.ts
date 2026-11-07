import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = signal<string>('admin');
  password = signal<string>('');
  tenantId = signal<string>('demo-cafe');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  onLogin(): void {
    if (!this.username() || !this.password()) {
      this.errorMessage.set('Please enter both username and password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login({
      username: this.username(),
      password: this.password(),
      tenantId: this.tenantId()
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Login failed. Invalid credentials.');
      }
    });
  }
}