// src/app/core/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task } from '../models/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

   private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {

    const dummyTasks: Task[] = [
      {
        id: 1,
        title: 'Prepare Attendance Report',
        assignedBy: 'Admin',
        assignedDate: '2026-01-10',
        completionDate: '2026-01-15',
        status: 'Pending'
      },
      {
        id: 2,
        title: 'Employee Onboarding',
        assignedBy: 'HR',
        assignedDate: '2026-01-08',
        completionDate: '2026-01-18',
        status: 'In Progress'
      },
      {
        id: 3,
        title: 'Monthly Salary Processing',
        assignedBy: 'Finance',
        assignedDate: '2026-01-05',
        completionDate: '2026-01-12',
        status: 'Completed'
      }
    ];

    return of(dummyTasks);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  addTask(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}Admin/insert-update-Task`, formData);
  }
}
