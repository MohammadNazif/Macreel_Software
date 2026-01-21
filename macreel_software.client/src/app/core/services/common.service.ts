import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private readonly apiUrl = environment.apiUrl;
  constructor(
    private readonly http:HttpClient
  ) { }

  downloadFile(filePath: string) {
    return this.http.get(
      `${this.apiUrl}Common/download-file`,
      {
        params: { filePath },
        responseType: 'blob'
      }
    );
  }
}
