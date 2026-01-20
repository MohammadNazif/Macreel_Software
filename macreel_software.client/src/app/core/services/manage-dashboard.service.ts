import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDashboard } from '../models/interface';
@Injectable({
  providedIn: 'root'
})
export class ManageDashboardService {


   private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

   getEmpDashboardCount(): Observable<any> {
      return this.http.get(`${this.baseUrl}Employee/getEmpDashBoardCountByEmpId`);
    }

getAdminDashboardCount(): Observable<{ data: AdminDashboard[] }> {
  return this.http.get<{ data: AdminDashboard[] }>(
    `${this.baseUrl}Admin/AdminDashboardCount`
  );
}

}



