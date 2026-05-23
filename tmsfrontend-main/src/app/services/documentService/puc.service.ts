import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PucService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  // this for adding  new PUC 


  addNewPUC(data: any,vehicleId:number) {
    return this.httpClient.post(`${this.url}/vehiclePUC/?vehicleId=${vehicleId}`, data);
  }
 
  // this for the  update fintness
  updatePUC(data: any) {
    return this.httpClient.put(`${this.url}/vehiclePUC/`, data);
  }

  // this for the deleting fintness by id
  deletePUCById(PUCId: number) {
    return this.httpClient.delete(`${this.url}/vehiclePUC/?id=${PUCId}`);
  }


  // this for the finding PUC by id
  findPUCById(id: number) {
    return this.httpClient.get(`${this.url}/vehiclePUC/${id}`);
  }


  // this for the finding all PUC
  findAllPUC() {
    return this.httpClient.get(`${this.url}/vehiclePUC/`);
  }

  findDocumentByPucId(id:number){
    return this.httpClient.get(`${this.url}/vehiclePUC/document/${id}`, { responseType: 'blob' });    
  }


}
