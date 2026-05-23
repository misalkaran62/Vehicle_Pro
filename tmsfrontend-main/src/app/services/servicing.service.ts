import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicingService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  insertdata(data: any): Observable<any> {
    return this.httpClient.post(`${this.url}/vehicleServicing/`, data);
  }

  getData(): Observable<any> {
    return this.httpClient.get(`${this.url}/vehicleServicing/`);
  }

  deleteOneServicingRow(servicingId: number): Observable<any> {
    return this.httpClient.delete(`${this.url}/vehicleServicing/?id=${servicingId}`);
  }

  getOneServicing(servicingId: number): Observable<any> {
    return this.httpClient.get(`${this.url}/vehicleServicing/${servicingId}`);
  }

  updateServicing(formData: any) {
    console.log("type changed value in service", formData.value);
    return this.httpClient.put(`${this.url}/vehicleServicing/`, formData);
  }

  getvehicleid(serviceId: number): Observable<any> {
    return this.httpClient.get(`${this.url}/vehicleServicing/getVehicleId?servicingId=${serviceId}`);
  }

  updateServicingStatus(serviceId: number, status: boolean) {
    console.log("updatestatus..", serviceId);
    console.log("status....", status);
    return this.httpClient.patch(`${this.url}/vehicleServicing/servicingapprovalstatus?servicingId=${serviceId}&status=${status}`, {})

  }

  changeServicingType(serviceId: number, type: any) {
    return this.httpClient.patch(`${this.url}/vehicleServicing/changeServicingType?servicingId=${serviceId}&servicingType=${type}`, {})

  }

  createservicing(vehicleId: number, data: any) {
    // console.log('tryimng to fetahc creating servicing',vehicleId);
    // console.log('tryimng to fetahc creating servicing',data);
    return this.httpClient.post(`${this.url}/vehicleServicing/?vehicleId=${vehicleId}`, data);;

  }

  findByIdImage(serivicingId: number,index: number,) {
    console.log("service id", serivicingId + "index",index);
    
  
    return this.httpClient.get(`${this.url}/vehicleServicing/document/${serivicingId}?type=partChange&index=${index}`, { responseType: 'blob' });
    // http://localhost:8181/vehicleServicing/document/22?type=document&index=1
    // return 
  }

  findByIdpayment(serivicingId: number) {
    console.log("service id", serivicingId);
    
  
    return this.httpClient.get(`${this.url}/vehicleServicing/document/${serivicingId}?type=rr`, { responseType: 'blob' });
    // http://localhost:8181/vehicleServicing/document/22?type=document&index=1
    // return 
  }

  findDateService(date: any) {
    return this.httpClient.get(`${this.url}/vehicleServicing/?createdAt=${date}`);
  }
  servicingMode(serviceId: number, mode: any) {
    console.log("current...servicr api" + serviceId + "mode", mode);

    return this.httpClient.patch(`${this.url}/vehicleServicing/changeCompletionStatus?servicingId=${serviceId}&completionStatus=${mode}`, {})

  }
}
