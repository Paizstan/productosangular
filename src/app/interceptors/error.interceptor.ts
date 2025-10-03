import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error desconocido';
        
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Datos inválidos. Por favor revisa la información.';
              break;
            case 401:
              errorMessage = 'No autorizado. Por favor inicia sesión.';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado.';
              break;
            case 409:
              errorMessage = error.error?.message || 'Ya existe un producto con ese nombre.';
              break;
            case 422:
              errorMessage = error.error?.message || 'Los datos proporcionados no son válidos.';
              break;
            case 500:
              errorMessage = 'Error interno del servidor. Intenta más tarde.';
              break;
            case 0:
              errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión.';
              break;
            default:
              errorMessage = `Error del servidor (${error.status}): ${error.message}`;
          }
        }
        
        console.error('Error HTTP:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}