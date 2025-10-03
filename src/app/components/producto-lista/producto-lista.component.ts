import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
        <div class="header">
        <h2>Gestión de Productos</h2>
        <div class="header-actions">
          <a class="btn btn-secondary" routerLink="/test-conexion" *ngIf="error">
            🔧 Diagnóstico
          </a>
          <a class="btn btn-secondary" routerLink="/productos-avanzado">
            Vista Avanzada
          </a>
          <button class="btn btn-primary" routerLink="/productos/nuevo">
            <i class="icon">+</i> Nuevo Producto
          </button>
        </div>
      </div>      <div class="alert alert-danger" *ngIf="error">
        {{ error }}
      </div>

      <div class="loading" *ngIf="loading">Cargando productos...</div>

      <div class="table-container" *ngIf="!loading">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let producto of productos" [class.low-stock]="producto.stock < 5">
              <td>{{ producto.id }}</td>
              <td>{{ producto.nombre }}</td>
              <td>{{ producto.categoria }}</td>
              <td>{{ producto.precio | currency:'USD':'symbol':'1.2-2' }}</td>
              <td>
                <span [class]="getStockClass(producto.stock)">
                  {{ producto.stock }}
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

        <div class="empty-state" *ngIf="productos.length === 0">
          <p>No hay productos registrados</p>
          <button class="btn btn-primary" routerLink="/productos/nuevo">
            Crear primer producto
          </button>
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
      max-width: 1200px;
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

    .header h2 {
      margin: 0;
      color: #333;
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
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .btn-small {
      padding: 6px 12px;
      font-size: 12px;
      margin-right: 5px;
    }

    .icon {
      margin-right: 5px;
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

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th,
    .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    .table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }

    .table tr:hover {
      background-color: #f8f9fa;
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

    .modal-content h3 {
      margin-top: 0;
      color: #333;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class ProductoListaComponent implements OnInit {
  productos: Producto[] = [];
  loading = false;
  error: string | null = null;
  productoAEliminar: Producto | null = null;

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
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
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
      },
      error: (error) => {
        this.notificationService.error(error.message);
        this.productoAEliminar = null;
      }
    });
  }
}