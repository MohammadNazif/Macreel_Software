import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResult, Task } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async uploadAttendance(formData: FormData): Promise<any> {
    return await firstValueFrom(
      this.http.post(
        `${this.baseUrl}Admin/uploadAttendance`,
        formData
      )
    );
  }

getAttendance(payload: {
  empCode: string;
  month: string;
  year: number;
}) {
  return this.http.get<any>(
    `${this.baseUrl}Admin/EmpAttendancebyEmpCode`,
    {
      params: {
        empCode: payload.empCode,
        month: payload.month,
        year: payload.year
      }
    }
  );
}
getAttendanceSummary(payload: {
  empCode: string;
  month: string;
  year: number;
}) {
  return this.http.get<any>(
    `${this.baseUrl}Admin/EmpMonthlyWorkingDetailByEmpCode`,
    {
      params: {
        empCode: payload.empCode,
        month: payload.month,
        year: payload.year
      }
    }
  );
}

  
  }

