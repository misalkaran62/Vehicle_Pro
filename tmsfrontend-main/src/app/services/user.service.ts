import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  startKmPhoto(tripId: number) {
    throw new Error('Method not implemented.');
  }
  findAllDriver() {
    throw new Error('Method not implemented.');
  }

  private url = `${environment.apiUrl}`;
  http: any;
  open: any;
  constructor(private httpClient: HttpClient) { }

  deleteuserdata(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/user/?id=${id}`);
  }

  findById(usid: number): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/user/${usid}`);
  }

  oneuser(usid: any) {
    return this.httpClient.get<any>(`${this.url}/user/${usid}`);
  }

  userRegistration(userData: any): Observable<any> {
    console.log('Registering user:', userData);
    return this.httpClient.post(`${this.url}/user/`, userData);
  }

  updateUser(userData: any): Observable<any> {
    console.log('updateUser:', userData);
    return this.httpClient.put(`${this.url}/user/`, userData);
  }

  findUserWeekly(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/user/`);
  }
  findAllUsers(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/user/all`);
  }
  findUserByDate(selectedDate: any) {
    return this.httpClient.get<any>(`${this.url}/user/?fromDate=${selectedDate}`);
  }

  gettingByDate() {
    return this.httpClient.get(`${this.url}/user/roleBranch?role=Driver`);
  }

  findDateDriver(date: any) {
    return this.httpClient.get(`${this.url}/user/roleBranch?role=Driver&fromDate=${date}`);
  }
  findCurrentLoginUser() {
    return this.httpClient.get(`${this.url}/auth/currentUser`);
  }

  findAllActiveDriver(branchId?: number): Observable<any> {
    let params = new HttpParams();
    console.log('active drivers in service' + branchId);
    // Append branchId if provided
    if (branchId) {
      params = params.append('branchId', branchId);
    }

    return this.httpClient.get<any>(`${this.url}/user/activeDriver`, {
      params,
    });
  }
  updateUserStatus(userId: number, status: boolean) {
    return this.httpClient.put(
      `${this.url}/user/userstatus?userId=${userId}&status=${status}`,
      {}
    );
  }
  findByIdImage(id: number, doc: any) {
    console.log('kuch ho raha hai',
      {
        id: id,
        doc: doc
      }
    );

    return this.httpClient.get(`${this.url}/user/document/${id}/${doc}`, { responseType: 'blob' });
  }
}
