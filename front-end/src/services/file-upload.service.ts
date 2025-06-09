import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'http://localhost:9428/api/file/upload';

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<{ filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    console.log("[File Upload Service]Demande de post de fichier")

    return this.http.post<{ filename: string }>(this.apiUrl, formData);
  }
}
