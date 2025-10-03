import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div 
        *ngFor="let notification of notifications" 
        class="notification"
        [ngClass]="'notification-' + notification.type"
        (click)="remove(notification.id)">
        <div class="notification-content">
          <div class="notification-icon">
            <span *ngIf="notification.type === 'success'">✓</span>
            <span *ngIf="notification.type === 'error'">✗</span>
            <span *ngIf="notification.type === 'warning'">⚠</span>
            <span *ngIf="notification.type === 'info'">ℹ</span>
          </div>
          <div class="notification-message">{{ notification.message }}</div>
          <button class="notification-close" (click)="remove(notification.id)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      width: 100%;
    }

    .notification {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 10px;
      padding: 16px;
      border-left: 4px solid;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: slideIn 0.3s ease-out;
    }

    .notification:hover {
      transform: translateX(-5px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .notification-success {
      border-left-color: #28a745;
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    }

    .notification-error {
      border-left-color: #dc3545;
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    }

    .notification-warning {
      border-left-color: #ffc107;
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    }

    .notification-info {
      border-left-color: #17a2b8;
      background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .notification-icon {
      font-size: 18px;
      font-weight: bold;
      min-width: 20px;
    }

    .notification-success .notification-icon {
      color: #155724;
    }

    .notification-error .notification-icon {
      color: #721c24;
    }

    .notification-warning .notification-icon {
      color: #856404;
    }

    .notification-info .notification-icon {
      color: #0c5460;
    }

    .notification-message {
      flex: 1;
      font-size: 14px;
      line-height: 1.4;
    }

    .notification-success .notification-message {
      color: #155724;
    }

    .notification-error .notification-message {
      color: #721c24;
    }

    .notification-warning .notification-message {
      color: #856404;
    }

    .notification-info .notification-message {
      color: #0c5460;
    }

    .notification-close {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.7;
      padding: 0;
      min-width: 20px;
      transition: opacity 0.2s;
    }

    .notification-close:hover {
      opacity: 1;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .notifications-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
      
      .notification {
        padding: 12px;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.getNotifications().subscribe(
      notifications => this.notifications = notifications
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  remove(id: string): void {
    this.notificationService.remove(id);
  }
}