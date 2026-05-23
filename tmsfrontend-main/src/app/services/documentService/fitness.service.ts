import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FitnessService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  // this for adding  new fitness 

  addNewFitness(data: any, vehicleId: number) {
    return this.httpClient.post(`${this.url}/vehicleFitness/?vehicleId=${vehicleId}`, data);
  }
  // this for the  update fintness
  updateFitness(data: any) {
    console.log('fitness Data yaha hai : ', data);

    return this.httpClient.put(`${this.url}/vehicleFitness/`, data);
  }

  // this for the deleting fintness by id
  deleteFitnessById(fitnessId: number) {
    return this.httpClient.delete(`${this.url}/vehicleFitness/?id=${fitnessId}`);
  }


  // this for the finding fitness by id
  findAllFitnessById(id: number) {
    return this.httpClient.get(`${this.url}/vehicleFitness/${id}`);
  }


  // this for the finding all fitness
  findAllFitness() {
    return this.httpClient.get(`${this.url}/vehicleFitness/`);
  }

  findDocumentByFitnessId(id:number){
    return this.httpClient.get(`${this.url}/vehicleFitness/document/${id}`, { responseType: 'blob' });    
  }

}
