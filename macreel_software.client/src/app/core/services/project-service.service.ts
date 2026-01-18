import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResult, Project } from '../models/interface';



@Injectable({ providedIn: 'root' })
export class ProjectService {

  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // Get projects with table-only loader (disable global loader)
 getProjects(search: string, page: number, size: number): Observable<PaginatedResult<Project>> {
    let params = new HttpParams()
      .set('searchTerm', search)
      .set('pageNumber', page)
      .set('pageSize', size);

    return this.http.get<PaginatedResult<Project>>(`${this.baseUrl}Admin/getAllProject`, { params });
  }

  // Delete project with table-only loader
  delete(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Skip-Global-Loader': 'true'  // Skip global loader here too
    });

    return this.http.delete(`${this.baseUrl}Admin/deleteProjectById?id=${id}`, { headers });
  }
}
