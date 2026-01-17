// src/app/core/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

   private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  addTask(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData);
  }
}
