import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
 url = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getBranches(): Observable<any[]> { // Change the return type to any[]
    return this.http.get<any[]>(`${this.url}/branch/`); // Assuming your GET method returns all branches
  }

  createBranch(branch: any): Observable<any> {
    console.log(branch);
    return this.http.post<any>(`${this.url}/branch/`, branch);
  }

  updateBranch(branch:any){
    return this.http.put<any>(`${this.url}/branch/`, branch);
  }

  getBranchbyid(id: any): Observable<any[]> { // Change the return type to any[]
    return this.http.get<any[]>(`${this.url}/branch/` + id); // Assuming your GET method returns all branches
  }

  // this for delete br
  getDeleteBranchId(id: any): Observable<any[]> {
    return this.http.delete<any[]>(`${this.url}/branch/?id=${id}`);
  }

  getUniqueBranches(manager:boolean) { 
    return this.http.get<any[]>(`${this.url}/branch/uniqueManReg?manager=${manager}`); 
  }

}
