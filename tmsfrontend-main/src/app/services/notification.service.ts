import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
 url = environment.apiUrl;
  constructor(private httpClient:HttpClient) { }

  findAllNotification() {
    return this.httpClient.get(`${this.url}/vehicleNotification/`)
  }

  findNotificationByDate(aajKiTarikh:any) {
    return this.httpClient.get(`${this.url}/vehicleNotification/byDate?createdAt=${aajKiTarikh}`)
  }

}
