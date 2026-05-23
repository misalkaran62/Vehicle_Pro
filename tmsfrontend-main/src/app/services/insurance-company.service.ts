import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsuranceCompanyService {

  private url = `${environment.apiUrl}/insuranceCompany`;
  http: any;

  constructor(private httpClient: HttpClient) { }


  // Create a new insurance company (POST request)
  createInsuranceCompany(insuranceCompany: any): Observable<any> {
    console.log('insurance data : ',insuranceCompany);
    
    return this.httpClient.post<any>(`${this.url}/`, insuranceCompany);
  }

  oneUser(id: any) {
    return this.httpClient.get(`${this.url}` + id)
  }

  // Update an insurance company (PUT request)
  updateInsuranceCompany(insuranceCompany: any, updateId: number): Observable<any> {
    return this.httpClient.put<any>(`${this.url}/`, insuranceCompany);
  }

  // Delete an insurance company by id (DELETE request)
  deleteInsuranceCompany(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/?id=${id}`);
  }

  // Get a specific insurance company by id (GET request)
  findById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/`+id);
  }

  // Get all insurance companies (GET request)
  findAll(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/`);
  }
}
