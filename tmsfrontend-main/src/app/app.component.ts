import { Component } from '@angular/core';
import { AutoLogoutServiceService } from './services/auto-logout-service.service';
import { IdleTimerService } from './services/idle-timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private idleTimerService: IdleTimerService) {}
  title = 'tms';

}
