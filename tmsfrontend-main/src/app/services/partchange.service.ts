import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartchangeService {
 private url = `${environment.apiUrl}/partChange`;
  constructor(private http: HttpClient) { }


  showParts(): Observable<any> 
  {
    // console.log("hiii am part change calling");
    return this.http.get(`${this.url}/`);
  }

  createPart(data: any): Observable<any> {
    console.log('part api',data);
      return this.http.post(`${this.url}/`, data);
    }

    removepart(id: number){
      
      return this.http.delete(`${this.url}/${id}`);
      // return this.httpClient.delete<any>(`${this.url}/?id=${id}`);
    }
    updatepart(data:any)
    {
      return this.http.put(`${this.url}/`, data);
    }
}
