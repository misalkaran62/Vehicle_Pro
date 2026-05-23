import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermitService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  // this for adding  new Permit 
  addNewPermit(data: any,vehicleId:number) {
    return this.httpClient.post(`${this.url}/vehiclePermit/?vehicleId=${vehicleId}`, data);
  }
  // this for the  update fintness
  updatePermit(formData: any) {
    return this.httpClient.put(`${this.url}/vehiclePermit/`, formData);
  }

  // this for the deleting fintness by id
  deletePermitById(PermitId: number) {
    return this.httpClient.delete(`${this.url}/vehiclePermit/?id=${PermitId}`);
  }


  // this for the finding Permit by id
  findPermitById(id: number) {
    return this.httpClient.get(`${this.url}/vehiclePermit/${id}`);
  }


  // this for the finding all Permit
  findAllPermit() {
    return this.httpClient.get(`${this.url}/vehiclePermit/`);
  }
  findDocumentByPermitId(id:number){
    return this.httpClient.get(`${this.url}/vehiclePermit/document/${id}`, { responseType: 'blob' });    
  }

}
