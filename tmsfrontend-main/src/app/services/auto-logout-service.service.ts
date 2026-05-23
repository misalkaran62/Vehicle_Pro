import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutServiceService {

  timeout: any; // Stores the timeout reference
  idleTime = 5 * 60 * 1000; // 5 minutes inactivity time (change as needed)

  constructor(private router: Router, private ngZone: NgZone) {
    this.startWatching();
  }

  /**
   * Start watching for user activity
   */
  startWatching() {
    // Clear any existing timers
    this.resetTimer();

    // Attach global event listeners for user activities
    ['mousemove', 'keydown', 'click', 'scroll'].forEach((event) => {
      window.addEventListener(event, () => this.resetTimer());
    });
  }

  /**
   * Reset the inactivity timer
   */
  resetTimer() {
    // Clear the previous timer
    clearTimeout(this.timeout);

    // Start a new timer
    this.ngZone.runOutsideAngular(() => {
      this.timeout = setTimeout(() => {
        this.logoutUser();
      }, this.idleTime);
    });
  }

  /**
   * Logout the user when timeout occurs
   */
  logoutUser() {
    // Clear session/local storage or user-specific tokens
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to the login page
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });

    alert('You have been logged out due to inactivity.');
  }
}
