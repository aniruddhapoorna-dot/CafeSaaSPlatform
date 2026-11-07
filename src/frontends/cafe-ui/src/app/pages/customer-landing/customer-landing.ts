import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuService, MenuItem } from '../../services/menu';

@Component({
  selector: 'app-customer-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-landing.html',
  styleUrl: './customer-landing.css'
})
export class CustomerLanding implements OnInit {
  tenantId = signal<string>('');
  tableId = signal<string>('');
  menuItems = signal<MenuItem[]>([]);
  cartCount = signal<number>(0);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    const tenant = this.route.snapshot.paramMap.get('tenantId') ?? 'demo-cafe';
    const table = this.route.snapshot.paramMap.get('tableId') ?? '0';

    this.tenantId.set(tenant);
    this.tableId.set(table);

    sessionStorage.setItem('tenantId', tenant);

    this.loadMenu();
  }

  loadMenu(): void {
    this.isLoading.set(true);
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load menu items:', err);
        this.errorMessage.set('Unable to load menu. Please check connection.');
        this.isLoading.set(false);
      }
    });
  }

  addToCart(item: MenuItem): void {
    this.cartCount.update((count) => count + 1);
  }
}