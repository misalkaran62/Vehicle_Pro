// geolocation.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error('Permission denied. Please enable location access.'));
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error('Position unavailable.'));
                break;
              case error.TIMEOUT:
                reject(new Error('Request timed out. Try again.'));
                break;
              default:
                reject(new Error('An unknown error occurred.'));
            }
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }
}
