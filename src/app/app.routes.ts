import { Routes } from '@angular/router';
import { ProductoListaComponent } from './components/producto-lista/producto-lista.component';
import { ProductoListaAvanzadaComponent } from './components/producto-lista-avanzada/producto-lista-avanzada.component';
import { ProductoFormComponent } from './components/producto-form/producto-form.component';
import { ConnectionTestComponent } from './components/connection-test/connection-test.component';

export const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoListaComponent },
  { path: 'productos-avanzado', component: ProductoListaAvanzadaComponent },
  { path: 'productos/nuevo', component: ProductoFormComponent },
  { path: 'productos/editar/:id', component: ProductoFormComponent },
  { path: 'test-conexion', component: ConnectionTestComponent },
  { path: '**', redirectTo: '/productos' }
];
