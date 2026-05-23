import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private apiUrl = 'http://localhost:5000/upload'; // Backend URL

    constructor(private http: HttpClient) {}

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(this.apiUrl, formData, {
            headers: new HttpHeaders(),
        });
    }
}
