import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddProjectService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEmpListForWebByTechId(techId: number): Observable<any> {
  return this.http.get<any>(
    `${this.baseUrl}Master/EmpListForWebTypeByTechId?techId=${techId}`
  );
}

getEmpListForAppByTechId(techId: number): Observable<any> {
  return this.http.get<any>(
    `${this.baseUrl}Master/EmpListForAppBtTechId?techId=${techId}`
  );
}


}
