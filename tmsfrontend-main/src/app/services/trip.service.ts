import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  // Adjust the URL based on your backend
  private url = `${environment.apiUrl}/trip`;
  set: any;
  updatetrip: any;

  constructor(private http: HttpClient) { }

  create(tripData: any) {
    console.log("im in service crete trip" + tripData);

    return this.http.post(`${this.url}/`, tripData);
  }

  // update(tripData: any) {
  //   return this.http.put(`${this.url}/`, tripData);
  // }
  update(tripData: FormData) {
    return this.http.put(`${this.url}/`, tripData);
  }

  updateManager(tripData: any) {
    return this.http.put(`${this.url}/managerUpdate`, tripData);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/?id=${id}`);
  }


  findById(id: number) {
    return this.http.get(`${this.url}/${id}`);
  }
  findByWeek() {
    return this.http.get<any[]>(`${this.url}/`);
  }
  findAll() {
    return this.http.get<any[]>(`${this.url}/all`);
  }
  findDateDriver(date:any) {
    return this.http.get(`${this.url}/?startDate=${date}`);
  }

  // updateTripStatus(tripId: number, status: string): Observable<any> {
  //   let params = new HttpParams().set('id', tripId.toString()).set('tripStatus', status);
  //   return this.http.patch(`${this.url}trip/status?`, null, { params });
  // }

  updateTripStatus(tripId: number, status: string): Observable<any> {
    let params = new HttpParams()
      .set('id', tripId.toString())
      .set('tripStatus', status);

    return this.http.patch(`${this.url}/status?/id=${'id'}/tripstatus=${status}`, null, { params });
    // this.set('id', tripId.toString())
    // this.set('tripStatus', status);

    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Retrieve the token from storage or a similar method
    // });

    // return this.http.patch(`${this.url}trip/status?`, { headers });
  }

  tripCancelled(obj: any): Observable<any> {
    // console.log('Object : ', obj);
    return this.http.patch(`${this.url}/status?id=${obj.tripId}&tripStatus=${obj.tripStatus}&cancellationReason=${obj.cancellationReason}`, null);
  }
}