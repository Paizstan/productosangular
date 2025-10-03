import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-connection-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="connection-test">
      <h3>🔧 Diagnóstico de Conexión</h3>
      
      <div class="test-section">
        <h4>URLs a probar:</h4>
        <div *ngFor="let url of backendUrls; let i = index" class="url-option">
          <input type="radio" [id]="'url-' + i" [(ngModel)]="backendUrl" [value]="url">
          <label [for]="'url-' + i">
            <code>{{ url }}</code>
          </label>
        </div>
      </div>

      <div class="test-section">
        <h4>Estado de conexión:</h4>
        <div class="status-indicator" [ngClass]="connectionStatus">
          {{ connectionMessage }}
        </div>
      </div>

      <div class="test-actions">
        <button class="btn btn-primary" (click)="testConnection()">
          🔄 Probar URL Seleccionada
        </button>
        <button class="btn btn-success" (click)="testAllUrls()">
          🚀 Probar Todas las URLs
        </button>
        <button class="btn btn-secondary" (click)="testHealthCheck()">
          ❤️ Health Check
        </button>
      </div>

      <div class="test-results" *ngIf="testResults">
        <h4>Resultados:</h4>
        <pre>{{ testResults | json }}</pre>
      </div>

      <div class="troubleshooting">
        <h4>💡 Soluciones comunes:</h4>
        <ul>
          <li>Verifica que el backend Java esté corriendo en puerto 8080</li>
          <li>Asegúrate de que CORS esté configurado en el backend</li>
          <li>Revisa la consola del navegador para errores detallados</li>
          <li>Intenta acceder directamente a: <a [href]="backendUrl" target="_blank">{{ backendUrl }}</a></li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .connection-test {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .test-section {
      margin: 15px 0;
      padding: 15px;
      border: 1px solid #e1e5e9;
      border-radius: 4px;
    }

    .status-indicator {
      padding: 10px;
      border-radius: 4px;
      font-weight: bold;
    }

    .status-indicator.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status-indicator.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .status-indicator.testing {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }

    .test-actions {
      margin: 20px 0;
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .test-results {
      margin: 20px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 4px;
      border: 1px solid #e9ecef;
    }

    .test-results pre {
      background: #ffffff;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #dee2e6;
      overflow-x: auto;
    }

    .troubleshooting {
      margin-top: 30px;
      padding: 20px;
      background: #e7f3ff;
      border-radius: 4px;
      border-left: 4px solid #007bff;
    }

    .troubleshooting ul {
      margin: 10px 0;
      padding-left: 20px;
    }

    .troubleshooting li {
      margin: 8px 0;
    }

    code {
      background: #f1f3f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    .url-option {
      margin: 8px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .url-option input[type="radio"] {
      margin: 0;
    }

    .url-option label {
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .btn-success {
      background-color: #28a745;
      color: white;
    }

    .btn-success:hover {
      background-color: #218838;
    }
  `]
})
export class ConnectionTestComponent {
  backendUrls = [
    'http://localhost:8080/api/productos', // ✅ URL correcta según tu Controller
    'http://localhost:8080/practica_api/productos',
    'http://localhost:8080/productos',
    'http://localhost:8080/practica-api/productos'
  ];
  backendUrl = this.backendUrls[0];
  connectionStatus = 'testing';
  connectionMessage = 'Sin probar';
  testResults: any = null;

  constructor(private http: HttpClient) {}

  testConnection() {
    this.connectionStatus = 'testing';
    this.connectionMessage = 'Probando conexión...';
    this.testResults = null;

    this.http.get(this.backendUrl).subscribe({
      next: (response) => {
        this.connectionStatus = 'success';
        this.connectionMessage = '✅ Conexión exitosa';
        this.testResults = response;
      },
      error: (error) => {
        this.connectionStatus = 'error';
        this.connectionMessage = `❌ Error: ${error.message}`;
        this.testResults = {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        };
      }
    });
  }

  testAllUrls() {
    this.connectionStatus = 'testing';
    this.connectionMessage = 'Probando todas las URLs...';
    this.testResults = { urlTests: [] };

    const testPromises = this.backendUrls.map(url => 
      this.http.get(url).toPromise()
        .then(response => ({ url, status: 'success', response }))
        .catch(error => ({ url, status: 'error', error: error.message }))
    );

    Promise.all(testPromises).then(results => {
      const successfulUrl = results.find(result => result.status === 'success');
      
      if (successfulUrl) {
        this.connectionStatus = 'success';
        this.connectionMessage = `✅ Conexión exitosa con: ${successfulUrl.url}`;
        this.backendUrl = successfulUrl.url;
      } else {
        this.connectionStatus = 'error';
        this.connectionMessage = '❌ Ninguna URL funcionó';
      }
      
      this.testResults = { urlTests: results };
    });
  }

  testHealthCheck() {
    const healthUrl = 'http://localhost:8080/actuator/health';
    
    this.connectionStatus = 'testing';
    this.connectionMessage = 'Probando health check...';
    this.testResults = null;

    this.http.get(healthUrl).subscribe({
      next: (response) => {
        this.connectionStatus = 'success';
        this.connectionMessage = '✅ Health check exitoso';
        this.testResults = response;
      },
      error: (error) => {
        // Intentar con la URL de productos directamente
        this.testConnection();
      }
    });
  }
}