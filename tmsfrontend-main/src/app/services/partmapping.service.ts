import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartmappingService {
 private url = `${environment.apiUrl}/partMapping`;
  constructor(private http:HttpClient) { }

  createPartMapping(data:any,vehicleId:number){
    return this.http.post(`${this.url}/?vehicleId=${vehicleId}`,data);
    
  }

  update(data: any){
    return this.http.put(`${this.url}/`,data)
  }
}
