import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <button (click)="goHome()">Go to Dashboard</button>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      text-align: center;
      margin-top: 50px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
