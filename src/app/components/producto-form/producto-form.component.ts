import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto';
import { Producto, ProductoRequest } from '../../models/producto.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>{{ isEditMode ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
        <button class="btn btn-secondary" routerLink="/productos">
          <i class="icon">←</i> Volver a la lista
        </button>
      </div>

      <div class="alert alert-danger" *ngIf="error">
        {{ error }}
      </div>

      <div class="form-container">
        <form [formGroup]="productoForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="nombre">Nombre del Producto *</label>
            <input
              type="text"
              id="nombre"
              formControlName="nombre"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('nombre')"
              placeholder="Ingresa el nombre del producto">
            <div class="invalid-feedback" *ngIf="isFieldInvalid('nombre')">
              <div *ngIf="productoForm.get('nombre')?.errors?.['required']">
                El nombre es obligatorio
              </div>
              <div *ngIf="productoForm.get('nombre')?.errors?.['minlength']">
                El nombre debe tener al menos 2 caracteres
              </div>
              <div *ngIf="productoForm.get('nombre')?.errors?.['maxlength']">
                El nombre no puede superar los 100 caracteres
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="categoria">Categoría *</label>
            <select
              id="categoria"
              formControlName="categoria"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('categoria')">
              <option value="">Selecciona una categoría</option>
              <option value="Electrónicos">Electrónicos</option>
              <option value="Hogar">Hogar</option>
              <option value="Ropa">Ropa</option>
              <option value="Deportes">Deportes</option>
              <option value="Libros">Libros</option>
              <option value="Salud">Salud</option>
              <option value="Automóvil">Automóvil</option>
              <option value="Otros">Otros</option>
            </select>
            <div class="invalid-feedback" *ngIf="isFieldInvalid('categoria')">
              <div *ngIf="productoForm.get('categoria')?.errors?.['required']">
                La categoría es obligatoria
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="precio">Precio *</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input
                  type="number"
                  id="precio"
                  formControlName="precio"
                  class="form-control"
                  [class.is-invalid]="isFieldInvalid('precio')"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01">
              </div>
              <div class="invalid-feedback" *ngIf="isFieldInvalid('precio')">
                <div *ngIf="productoForm.get('precio')?.errors?.['required']">
                  El precio es obligatorio
                </div>
                <div *ngIf="productoForm.get('precio')?.errors?.['min']">
                  El precio debe ser mayor a 0
                </div>
                <div *ngIf="productoForm.get('precio')?.errors?.['max']">
                  El precio no puede superar $999,999.99
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                formControlName="stock"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('stock')"
                placeholder="0"
                min="0">
              <div class="invalid-feedback" *ngIf="isFieldInvalid('stock')">
                <div *ngIf="productoForm.get('stock')?.errors?.['required']">
                  El stock es obligatorio
                </div>
                <div *ngIf="productoForm.get('stock')?.errors?.['min']">
                  El stock no puede ser negativo
                </div>
                <div *ngIf="productoForm.get('stock')?.errors?.['max']">
                  El stock no puede superar 999,999 unidades
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary"
              routerLink="/productos">
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="productoForm.invalid || isSubmitting">
              <span *ngIf="isSubmitting">Guardando...</span>
              <span *ngIf="!isSubmitting">
                {{ isEditMode ? 'Actualizar Producto' : 'Crear Producto' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
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

    .btn:disabled {
      opacity: 0.6;
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

    .btn-secondary:hover {
      background-color: #545b62;
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

    .form-container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .input-group {
      display: flex;
    }

    .input-group-text {
      background-color: #e9ecef;
      border: 1px solid #ced4da;
      border-right: none;
      padding: 10px 12px;
      border-radius: 4px 0 0 4px;
      color: #495057;
    }

    .input-group .form-control {
      border-radius: 0 4px 4px 0;
    }

    select.form-control {
      background-color: white;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 8px center;
      background-repeat: no-repeat;
      background-size: 16px 12px;
      padding-right: 40px;
      appearance: none;
    }

    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 4px;
      font-size: 12px;
      color: #dc3545;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .form-actions .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ProductoFormComponent implements OnInit {
  productoForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  error: string | null = null;
  productoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(100)
      ]],
      categoria: ['', Validators.required],
      precio: ['', [
        Validators.required, 
        Validators.min(0.01), 
        Validators.max(999999.99)
      ]],
      stock: ['', [
        Validators.required, 
        Validators.min(0), 
        Validators.max(999999)
      ]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productoId = +id;
      this.cargarProducto(this.productoId);
    }
  }

  cargarProducto(id: number): void {
    this.productoService.getProducto(id).subscribe({
      next: (producto) => {
        this.productoForm.patchValue(producto);
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const productoData: ProductoRequest = this.productoForm.value;

    const operation = this.isEditMode && this.productoId
      ? this.productoService.updateProducto(this.productoId, productoData)
      : this.productoService.createProducto(productoData);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Producto actualizado correctamente' : 'Producto creado correctamente';
        this.notificationService.success(message);
        this.router.navigate(['/productos']);
      },
      error: (error) => {
        this.notificationService.error(error.message);
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productoForm.controls).forEach(key => {
      const control = this.productoForm.get(key);
      control?.markAsTouched();
    });
  }
}