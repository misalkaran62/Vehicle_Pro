import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  put(routeId: any) {
    throw new Error('Method not implemented.');
  }
  private routeUpdated = new Subject<any>();
  routeUpdated$ = this.routeUpdated.asObservable();

  emitRouteUpdate(data: any) {
    console.log("emitrouteupdate",data);
    this.routeUpdated.next(data);
  }
  url=environment.apiUrl;
  constructor(private httpClient:HttpClient) { }

  // this for the vehicle registeration
  addNewRoute(route:any){
    return this.httpClient.post(`${this.url}/route/`,route)
   }
 
   updateRoute(route:any){
    return this.httpClient.put(`${this.url}/route/`,route)
   }
 
 // this for the fetching all Vehicle
     showAllRoute(){
       return this.httpClient.get(`${this.url}/route/`)
     }


   
     // this for the delete vehicle
     deleteVehicleById(vehicleId:number){
       // console.log(`Sending DELETE request for vehicle ID: ${vehicleId}`);
   return this.httpClient.delete(`${this.url}/vehicle/?id=${vehicleId}`);
     }
 
}
