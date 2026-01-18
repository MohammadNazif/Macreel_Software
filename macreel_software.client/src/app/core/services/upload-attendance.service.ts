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

  getAttendance(search = '', page = 1, size = 20) {
    return this.http.get<PaginatedResult<Task>>(
      `${this.baseUrl}Admin/getAllAssignTask`,
      { params: { search, page, size } }
    );
  }
  
  }

