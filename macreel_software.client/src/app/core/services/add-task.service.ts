import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResult, Task } from '../models/interface';





@Injectable({
  providedIn: 'root'
})
export class TaskService {

   private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

getTasks(search = '', page = 1, size = 20) {
  return this.http.get<PaginatedResult<Task>>(
    `${this.baseUrl}Admin/getAllAssignTask`,
    { params: { search, page, size } }
  );
}


  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  addTask(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}Admin/insert-update-Task`, formData);
  }
}
