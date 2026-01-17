import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../models/employee.interface';

@Injectable({ providedIn: 'root' })
export class ProjectService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get projects with table-only loader (disable global loader)
  getProjects(
    searchTerm: string = '',
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<any> {

const headers = new HttpHeaders({ 'ignoreLoadingBar': 'true' });
    return this.http.get(`${this.baseUrl}Admin/getAllProject`, {
      params: { searchTerm, pageNumber, pageSize },
      headers 
    });
  }

  // Delete project with table-only loader
  delete(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Skip-Global-Loader': 'true'  // Skip global loader here too
    });

    return this.http.delete(`${this.baseUrl}Admin/deleteProjectById?id=${id}`, { headers });
  }
}
