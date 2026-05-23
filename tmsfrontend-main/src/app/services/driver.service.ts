import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverService {


  private url = `${environment.apiUrl}`;
  http: any;
  open: any;
  constructor(private httpClient: HttpClient) { }

  deleteDriverdata(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/user/?id=${id}`);
  }

  findById(usid: number): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/user/${usid}`);
  }

  oneuser(usid: any) {
    return this.httpClient.get<any>(`${this.url}/user/${usid}`); 
  }

  DriverRegistration(userData: any): Observable<any> {
    console.log('Registering user:', userData);
    return this.httpClient.post(`${this.url}/user/`, userData);
  }

  updateDriver(userData: any): Observable<any> {
    console.log('updateUser:', userData);
    return this.httpClient.put(`${this.url}/user/`, userData);
  }

 
  findAllDriver(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/user/allDrivers?role=driver`);
  }

  gettingByDate() {
    return this.httpClient.get(`${this.url}/user/roleBranch?role=Driver`);
  }

  findDateDriver(date:any) {
    return this.httpClient.get(`${this.url}/user/roleBranch?role=Driver&fromDate=${date}`);
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
  updateDriverStatus(userId: number, status: boolean) {
    return this.httpClient.put(
      `${this.url}/user/userstatus?userId=${userId}&status=${status}`,
      {}
    );
  }
  findByIdImage(id: number, doc: any) {

    return this.httpClient.get(`${this.url}/user/document/${id}/${doc}`, { responseType: 'blob' });
  }
}
