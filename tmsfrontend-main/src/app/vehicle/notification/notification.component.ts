import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications: any[] = [];
  filteredNotifications: any[] = [];
  searchTerm: string = '';
  selectedDate: string = '';
  page: number = 1;


  constructor(private route: Router, private notificationService: NotificationService) { }
  ngOnInit(): void {
    this.findAllNotification();
  }


  findAllNotification() {
    this.notificationService.findAllNotification().subscribe((response: any) => {
      console.log('Notifications fetched:', response);
      this.notifications = response;
      this.notifications.forEach((notification) =>
        console.log(`ID: ${notification.notificationId}, Type: ${typeof notification.notificationId}`)
      );
      this.filteredNotifications = [...this.notifications];
    },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    )
  }

  searchNotification() {
    const term = this.searchTerm.toLowerCase().trim();
    console.log('Search term:', term);

    if (term) {
      // Filter notifications by matching ID, vehicle number, or manager name
      this.filteredNotifications = this.notifications.filter((notification) => {
        const idMatch = String(notification.notificationId || '').toLowerCase().includes(term);
        const vehilceRegNo = String(notification.vehilceRegNo || '').toLowerCase().includes(term);
        const userName = String(notification.userName || '').toLowerCase().includes(term);

        return idMatch || vehilceRegNo || userName;
      });
    } else {
      // Reset to full list if search term is empty
      this.filteredNotifications = [...this.notifications];
    }
  }


  filterByDate() {
    if (this.selectedDate) {
      const formattedSelectedDate = this.formatDateForSearch(this.selectedDate);

      this.filteredNotifications = this.notifications.filter((notification) => {
        const dateMatch = this.formatDateForSearch(notification.notificationDate || '').includes(formattedSelectedDate);
        return dateMatch;
      });

    } else {
      this.filteredNotifications = [...this.notifications];
    }
    console.log('Filtered by Date:', this.filteredNotifications);
  }


  private formatDateForSearch(date: any): string {
    if (!date) return ''; // Handle null or undefined dates
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`; // e.g., "26-11-24"
  }

}
