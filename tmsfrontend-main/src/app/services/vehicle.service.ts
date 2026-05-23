import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  getVehicleById(vehicleId: any) {
    throw new Error('Method not implemented.');
  }
 url = environment.apiUrl;
  // http: any;

  constructor(private httpClient: HttpClient) { }



  // this for the vehicle registeration
  registerVehicle(vehicleData: any) {
    return this.httpClient.post(`${this.url}/vehicle/`, vehicleData)
  }

  updateVehicle(vehicleData: any) {
    return this.httpClient.put(`${this.url}/vehicle/`, vehicleData)
  }

  // this for the fetching all Vehicle
  showAllVehicle() {
    return this.httpClient.get(`${this.url}/vehicle/`)
  }

  // this for the delete vehicle
  deleteVehicleById(vehicleId: number) {
    // console.log(`Sending DELETE request for vehicle ID: ${vehicleId}`);
    return this.httpClient.delete(`${this.url}/vehicle/?id=${vehicleId}`);
  }
  findWithoutDate() {
    return this.httpClient.get(`${this.url}/vehicle/dateFilter`);
  }
  findDateDriver(date:any) {
    return this.httpClient.get(`${this.url}/vehicle/dateFilter?createdAt=${date}`);
  }

  // In vehicle.service.ts
  findAllVehiclesByBranch(branchId?: number): Observable<any> {

    let params = new HttpParams();
    console.log("active vehicle in service" + branchId);
    // Append branchId if provided
    if (branchId) {
      params = params.append('branchId', branchId);
    }
    // console.log("active drivers"+this.drivers);

    return this.httpClient.get<any>(`${this.url}/vehicle/available`,{
      params
    })
      
      // ?branchId=${branchId}`);
  }

  findByVehicleId(id: any) {

    return this.httpClient.get<any>(`${this.url}/vehicle/${id}`);
  }
  findVehicleImageById(documentId: number, docType: any) {
    return this.httpClient.get(`${this.url}/vehicle/document/${documentId}`, { responseType: 'blob' });    

  }
}
