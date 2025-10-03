import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductoService } from './producto';
import { Producto, ProductoRequest } from '../models/producto.model';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService]
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve productos from the API via GET', () => {
    const dummyProductos: Producto[] = [
      {
        id: 1,
        nombre: 'Producto Test 1',
        categoria: 'Electrónicos',
        precio: 100.50,
        stock: 10
      },
      {
        id: 2,
        nombre: 'Producto Test 2',
        categoria: 'Hogar',
        precio: 75.25,
        stock: 5
      }
    ];

    service.getProductos().subscribe(productos => {
      expect(productos.length).toBe(2);
      expect(productos).toEqual(dummyProductos);
    });

    const req = httpMock.expectOne('http://localhost:8080/productos');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProductos);
  });

  it('should create a producto via POST', () => {
    const newProducto: ProductoRequest = {
      nombre: 'Nuevo Producto',
      categoria: 'Ropa',
      precio: 50.00,
      stock: 20
    };

    const createdProducto: Producto = {
      id: 3,
      ...newProducto
    };

    service.createProducto(newProducto).subscribe(producto => {
      expect(producto).toEqual(createdProducto);
    });

    const req = httpMock.expectOne('http://localhost:8080/productos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProducto);
    req.flush(createdProducto);
  });

  it('should update a producto via PUT', () => {
    const updateProducto: ProductoRequest = {
      nombre: 'Producto Actualizado',
      categoria: 'Deportes',
      precio: 125.00,
      stock: 15
    };

    const updatedProducto: Producto = {
      id: 1,
      ...updateProducto
    };

    service.updateProducto(1, updateProducto).subscribe(producto => {
      expect(producto).toEqual(updatedProducto);
    });

    const req = httpMock.expectOne('http://localhost:8080/productos/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateProducto);
    req.flush(updatedProducto);
  });

  it('should delete a producto via DELETE', () => {
    service.deleteProducto(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/productos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle HTTP error gracefully', () => {
    service.getProductos().subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error) => {
        expect(error.message).toContain('Error del servidor');
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/productos');
    expect(req.request.method).toBe('GET');
    req.flush('Something went wrong', { status: 500, statusText: 'Internal Server Error' });
  });
});
