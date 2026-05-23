import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RoadtaxService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  // this for adding  new RoadTax 
  addNewRoadTax(data: any,vehicleId:number) {
    return this.httpClient.post(`${this.url}/vehicleRoadTax/?vehicleId=${vehicleId}`, data);
  }
  // this for the  update fintness
  updateRoadTax(data: any) {
    return this.httpClient.put(`${this.url}/vehicleRoadTax/`, data);
  }

  // this for the deleting fintness by id
  deleteRoadTaxById(RoadTaxId: number) {
    return this.httpClient.delete(`${this.url}/vehicleRoadTax/?id=${RoadTaxId}`);
  }


  // this for the finding RoadTax by id
  findRoadTaxById(id: number) {
    return this.httpClient.get(`${this.url}/vehicleRoadTax/${id}`);
  }


  // this for the finding all RoadTax
  findAllRoadTax() {
    return this.httpClient.get(`${this.url}/vehicleRoadTax/`);
  }

  findDocumentByRoadTaxId(id:number){
    console.log("road Tax documnent id",id)
    return this.httpClient.get(`${this.url}/vehicleRoadTax/document/${id}`, { responseType: 'blob' });    
  }
}
