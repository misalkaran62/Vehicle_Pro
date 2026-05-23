import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RcbookService {
  url=environment.apiUrl;

  constructor(private httpClient:HttpClient) { }
  
  findDocument(id:number){
    return this.httpClient.get(`${this.url}/vehicleRCBook/document/${id}`, { responseType: 'blob' });    
  }
}
