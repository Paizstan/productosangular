import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto.model';
import { NotificationService } from '../../services/notification.service';

interface SortConfig {
  key: keyof Producto;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-producto-lista-avanzada',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Gestión de Productos</h2>
        <div class="header-actions">
          <button class="btn btn-primary" routerLink="/productos/nuevo">
            <i class="icon">+</i> Nuevo Producto
          </button>
        </div>
      </div>

      <!-- Controles de filtro y búsqueda -->
      <div class="controls-section">
        <div class="search-controls">
          <div class="search-group">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              class="form-control search-input">
            <button class="btn btn-secondary" (click)="clearSearch()">Limpiar</button>
          </div>
          
          <div class="filter-group">
            <select [(ngModel)]="selectedCategory" (change)="onFilterChange()" class="form-control">
              <option value="">Todas las categorías</option>
              <option *ngFor="let categoria of categorias" [value]="categoria">{{ categoria }}</option>
            </select>
          </div>

          <div class="filter-group">
            <select [(ngModel)]="stockFilter" (change)="onFilterChange()" class="form-control">
              <option value="">Todo el stock</option>
              <option value="low">Stock bajo (<5)</option>
              <option value="medium">Stock medio (5-20)</option>
              <option value="high">Stock alto (>20)</option>
            </select>
          </div>

          <div class="items-per-page">
            <label>Elementos por página:</label>
            <select [(ngModel)]="itemsPerPage" (change)="onItemsPerPageChange()" class="form-control">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <div class="alert alert-danger" *ngIf="error">
        {{ error }}
      </div>

      <div class="loading" *ngIf="loading">Cargando productos...</div>

      <!-- Información de resultados -->
      <div class="results-info" *ngIf="!loading">
        <p>Mostrando {{ paginatedProductos.length }} de {{ filteredProductos.length }} productos
          <span *ngIf="searchTerm || selectedCategory || stockFilter">(filtrados de {{ productos.length }} total)</span>
        </p>
      </div>

      <div class="table-container" *ngIf="!loading">
        <table class="table">
          <thead>
            <tr>
              <th (click)="sort('id')" class="sortable">
                ID
                <span class="sort-indicator" [ngClass]="getSortIcon('id')"></span>
              </th>
              <th (click)="sort('nombre')" class="sortable">
                Nombre
                <span class="sort-indicator" [ngClass]="getSortIcon('nombre')"></span>
              </th>
              <th (click)="sort('categoria')" class="sortable">
                Categoría
                <span class="sort-indicator" [ngClass]="getSortIcon('categoria')"></span>
              </th>
              <th (click)="sort('precio')" class="sortable">
                Precio
                <span class="sort-indicator" [ngClass]="getSortIcon('precio')"></span>
              </th>
              <th (click)="sort('stock')" class="sortable">
                Stock
                <span class="sort-indicator" [ngClass]="getSortIcon('stock')"></span>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let producto of paginatedProductos" [class.low-stock]="producto.stock < 5">
              <td>{{ producto.id }}</td>
              <td>{{ producto.nombre }}</td>
              <td>
                <span class="category-badge" [attr.data-category]="producto.categoria">
                  {{ producto.categoria }}
                </span>
              </td>
              <td>{{ producto.precio | currency:'USD':'symbol':'1.2-2' }}</td>
              <td>
                <span [class]="getStockClass(producto.stock)">
                  {{ producto.stock }}
                  <span *ngIf="producto.stock < 5" class="stock-warning">⚠️</span>
                </span>
              </td>
              <td class="actions">
                <button 
                  class="btn btn-small btn-secondary"
                  [routerLink]="['/productos/editar', producto.id]">
                  Editar
                </button>
                <button 
                  class="btn btn-small btn-danger"
                  (click)="confirmarEliminacion(producto)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty-state" *ngIf="filteredProductos.length === 0 && !loading">
          <div *ngIf="searchTerm || selectedCategory || stockFilter; else noProducts">
            <p>No se encontraron productos con los filtros aplicados</p>
            <button class="btn btn-secondary" (click)="clearAllFilters()">
              Limpiar filtros
            </button>
          </div>
          <ng-template #noProducts>
            <p>No hay productos registrados</p>
            <button class="btn btn-primary" routerLink="/productos/nuevo">
              Crear primer producto
            </button>
          </ng-template>
        </div>

        <!-- Paginación -->
        <div class="pagination-container" *ngIf="totalPages > 1">
          <div class="pagination">
            <button 
              class="btn btn-small btn-secondary"
              [disabled]="currentPage === 1"
              (click)="goToPage(1)">
              «
            </button>
            <button 
              class="btn btn-small btn-secondary"
              [disabled]="currentPage === 1"
              (click)="goToPage(currentPage - 1)">
              ‹
            </button>
            
            <span class="pagination-info">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button 
              class="btn btn-small btn-secondary"
              [disabled]="currentPage === totalPages"
              (click)="goToPage(currentPage + 1)">
              ›
            </button>
            <button 
              class="btn btn-small btn-secondary"
              [disabled]="currentPage === totalPages"
              (click)="goToPage(totalPages)">
              »
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación -->
      <div class="modal" *ngIf="productoAEliminar" (click)="cancelarEliminacion()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h3>Confirmar eliminación</h3>
          <p>¿Estás seguro de que deseas eliminar el producto <strong>{{ productoAEliminar.nombre }}</strong>?</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="cancelarEliminacion()">Cancelar</button>
            <button class="btn btn-danger" (click)="eliminarProducto()">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .controls-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }

    .search-controls {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 15px;
      align-items: end;
    }

    .search-group {
      display: flex;
      gap: 10px;
    }

    .search-input {
      flex: 1;
    }

    .filter-group label,
    .items-per-page label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: #333;
      font-size: 12px;
    }

    .results-info {
      margin-bottom: 15px;
      color: #666;
      font-size: 14px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .table th {
      background-color: #f8f9fa;
      padding: 15px 12px;
      text-align: left;
      font-weight: 600;
      color: #495057;
      border-bottom: 2px solid #dee2e6;
    }

    .table th.sortable {
      cursor: pointer;
      user-select: none;
      position: relative;
      transition: background-color 0.2s;
    }

    .table th.sortable:hover {
      background-color: #e9ecef;
    }

    .sort-indicator {
      margin-left: 5px;
      opacity: 0.5;
    }

    .sort-indicator.sort-asc::after {
      content: '↑';
      opacity: 1;
      color: #007bff;
    }

    .sort-indicator.sort-desc::after {
      content: '↓';
      opacity: 1;
      color: #007bff;
    }

    .sort-indicator:not(.sort-asc):not(.sort-desc)::after {
      content: '↕';
    }

    .table td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }

    .table tr:hover {
      background-color: #f8f9fa;
    }

    .category-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      background-color: #e9ecef;
      color: #495057;
    }

    .category-badge[data-category="Electrónicos"] {
      background-color: #cfe2ff;
      color: #0a58ca;
    }

    .category-badge[data-category="Hogar"] {
      background-color: #d1e7dd;
      color: #0f5132;
    }

    .category-badge[data-category="Ropa"] {
      background-color: #f8d7da;
      color: #721c24;
    }

    .stock-warning {
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }

    .pagination {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .pagination-info {
      margin: 0 15px;
      font-weight: 500;
      color: #495057;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      font-size: 14px;
      transition: all 0.2s;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #545b62;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c82333;
    }

    .btn-small {
      padding: 6px 12px;
      font-size: 12px;
      margin-right: 5px;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .low-stock {
      background-color: #fff3cd !important;
    }

    .stock-low {
      color: #856404;
      font-weight: bold;
    }

    .stock-medium {
      color: #e68900;
    }

    .stock-high {
      color: #28a745;
    }

    .actions {
      white-space: nowrap;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 24px;
      border-radius: 8px;
      max-width: 400px;
      width: 90%;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    .alert {
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    @media (max-width: 768px) {
      .search-controls {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      
      .table-container {
        overflow-x: auto;
      }
      
      .table {
        min-width: 800px;
      }
    }
  `]
})
export class ProductoListaAvanzadaComponent implements OnInit {
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  paginatedProductos: Producto[] = [];
  categorias: string[] = [];
  
  loading = false;
  error: string | null = null;
  productoAEliminar: Producto | null = null;

  // Filtros y búsqueda
  searchTerm = '';
  selectedCategory = '';
  stockFilter = '';

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Ordenamiento
  sortConfig: SortConfig = { key: 'id', direction: 'asc' };

  constructor(
    private productoService: ProductoService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = null;
    
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.extractCategorias();
        this.applyFiltersAndSort();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  private extractCategorias(): void {
    this.categorias = [...new Set(this.productos.map(p => p.categoria))];
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.stockFilter = '';
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  private applyFiltersAndSort(): void {
    // Aplicar filtros
    this.filteredProductos = this.productos.filter(producto => {
      const matchesSearch = !this.searchTerm || 
        producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        producto.categoria === this.selectedCategory;
      
      const matchesStock = !this.stockFilter || this.matchesStockFilter(producto.stock);

      return matchesSearch && matchesCategory && matchesStock;
    });

    // Aplicar ordenamiento
    this.filteredProductos.sort((a, b) => {
      const aValue = a[this.sortConfig.key];
      const bValue = b[this.sortConfig.key];
      
      let comparison = 0;
      if (aValue != null && bValue != null) {
        if (aValue < bValue) comparison = -1;
        else if (aValue > bValue) comparison = 1;
      }
      
      return this.sortConfig.direction === 'desc' ? -comparison : comparison;
    });

    // Calcular paginación
    this.totalPages = Math.ceil(this.filteredProductos.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    this.updatePaginatedProducts();
  }

  private matchesStockFilter(stock: number): boolean {
    switch (this.stockFilter) {
      case 'low': return stock < 5;
      case 'medium': return stock >= 5 && stock <= 20;
      case 'high': return stock > 20;
      default: return true;
    }
  }

  private updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProductos = this.filteredProductos.slice(startIndex, endIndex);
  }

  sort(key: keyof Producto): void {
    if (this.sortConfig.key === key) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig = { key, direction: 'asc' };
    }
    this.applyFiltersAndSort();
  }

  getSortIcon(key: keyof Producto): string {
    if (this.sortConfig.key !== key) return '';
    return this.sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  getStockClass(stock: number): string {
    if (stock < 5) return 'stock-low';
    if (stock < 20) return 'stock-medium';
    return 'stock-high';
  }

  confirmarEliminacion(producto: Producto): void {
    this.productoAEliminar = producto;
  }

  cancelarEliminacion(): void {
    this.productoAEliminar = null;
  }

  eliminarProducto(): void {
    if (!this.productoAEliminar?.id) return;

    this.productoService.deleteProducto(this.productoAEliminar.id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id !== this.productoAEliminar!.id);
        this.notificationService.success('Producto eliminado correctamente');
        this.productoAEliminar = null;
        this.applyFiltersAndSort();
      },
      error: (error) => {
        this.notificationService.error(error.message);
        this.productoAEliminar = null;
      }
    });
  }
}