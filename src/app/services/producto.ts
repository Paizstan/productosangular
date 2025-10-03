import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Producto, ProductoRequest } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // URL correcta basada en tu Controller Java:
  private apiUrl = 'http://localhost:8080/api/productos'; // ✅ Coincide con @RequestMapping("/api")

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl)
      .pipe(
        retry(1), // Reintentar una vez en caso de error
        catchError(this.handleError)
      );
  }

  // Obtener producto por ID
  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Crear nuevo producto
  createProducto(producto: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto)
      .pipe(catchError(this.handleError));
  }

  // Actualizar producto
  updateProducto(id: number, producto: ProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto)
      .pipe(catchError(this.handleError));
  }

  // Eliminar producto
  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    console.error('Error HTTP completo:', error);
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080';
          break;
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos. Por favor revisa la información.';
          break;
        case 404:
          errorMessage = 'Producto no encontrado.';
          break;
        case 409:
          errorMessage = error.error?.message || 'Ya existe un producto con ese nombre.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
          break;
        default:
          errorMessage = `Error del servidor (${error.status}): ${error.error?.message || error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
