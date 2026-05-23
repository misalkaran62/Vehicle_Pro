import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  url=environment.apiUrl;
  constructor(private httpClient:HttpClient) { }

   // this for adding  new Insurance 

   addNewInsurance(data: any,vehicleId:number) {
    return this.httpClient.post(`${this.url}/vehicleInsurance/?vehicleId=${vehicleId}`, data);
  }

  // this for the  update fintness
  updateInsurance(data: any) {
    return this.httpClient.put(`${this.url}/vehicleInsurance/`, data);
  }

  // this for the deleting fintness by id
  deleteInsuranceById(InsuranceId: number) {
    return this.httpClient.delete(`${this.url}/vehicleInsurance/?id=${InsuranceId}`);
  }


  // this for the finding Insurance by id
  findInsuranceById(id: number) {
    return this.httpClient.get(`${this.url}/vehicleInsurance/${id}`);
  }


  // this for the finding all Insurance
  findAllInsurance() {
    return this.httpClient.get(`${this.url}/vehicleInsurance/`);
  }


  showdata()
  {
    return this.httpClient.get(`${this.url}/vehicleInsurance/`);
  }

 
  findDocumentByInsuranceId(id:number){
    return this.httpClient.get(`${this.url}/vehicleInsurance/document/${id}`, { responseType: 'blob' });    
  }
  

}
