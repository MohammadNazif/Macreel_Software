import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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
}
