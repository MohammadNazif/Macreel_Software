import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ManageDashboardService {


   private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

   getEmpDashboardCount(): Observable<any> {
      return this.http.get(`${this.baseUrl}Employee/getEmpDashBoardCountByEmpId`);
    }
}
