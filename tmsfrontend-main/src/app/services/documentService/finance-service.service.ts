import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceServiceService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  // this for adding  new fitness 

  addNewVehicleFinance(data: any, vehicleId: number) {
    return this.httpClient.post(`${this.url}/vehicleFitness/?vehicleId=${vehicleId}`, data);
  }
  // this for the  update fintness
  updateVehicleFinance(data: any) {
    console.log('fitness Data yaha hai : ', data);

    return this.httpClient.put(`${this.url}/vehicleFinance/`, data);
  }

  // this for the deleting fintness by id
  deleteVehicleFinanceById(fitnessId: number) {
    return this.httpClient.delete(`${this.url}/vehicleFinance/?id=${fitnessId}`);
  }


  // this for the finding fitness by id
  findAllVehicleFinanceById(id: number) {
    return this.httpClient.get(`${this.url}/vehicleFinance/${id}`);
  }


  // this for the finding all fitness
  findAllVehicleFinance() {
    return this.httpClient.get(`${this.url}/vehicleFinance/`);
  }

  findDocumentByVehicleFinance(id:number,type:string){
    return this.httpClient.get(`${this.url}/vehicleFinance/document/${id}?type=${type}`, { responseType: 'blob' });    
  }

}
