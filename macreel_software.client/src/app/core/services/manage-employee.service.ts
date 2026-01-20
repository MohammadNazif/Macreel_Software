import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ManageEmployeeService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addEmployee(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}Admin/insertEmployeeRegistration`,
      formData
    );
  }

  getAllStateList(): Observable<any> {
    return this.http.get(`${this.baseUrl}Common/getAllStateList`);
  }

  getCityByStateId(stateId: number): Observable<any> {
    const params = new HttpParams().set('stateId', stateId.toString());
    return this.http.get(`${this.baseUrl}Common/GetCityByStateId`, { params });
  }

  getReportingManager(): Observable<any> {
    return this.http.get(`${this.baseUrl}Common/getReportingManager`);
  }

  getAllEmployees(pageNumber: number | null = null, pageSize: number | null = null, searchText: string = '') {
    let params = new HttpParams();

    if (pageNumber !== null) params = params.set('pageNumber', pageNumber.toString());
    if (pageSize !== null) params = params.set('pageSize', pageSize.toString());
    if (searchText) params = params.set('searchTerm', searchText);

    return this.http.get<any>(`${this.baseUrl}Admin/GetAllEmployees`, { params });
  }

  getEmployeeById(id: number) {
    return this.http.get(`${this.baseUrl}Admin/getEmployeeById?id=${id}`);
  }

  updateEmployee(data: FormData) {
    return this.http.post(
      `${this.baseUrl}Admin/updateEmployeeRegistration`, data
    );
  }
  deleteDepartmentById(id: number) {
    return this.http.delete<any>(`${this.baseUrl}Admin/deleteEmployeeById?id=${id}`);
  }

sendLinkForReg(payload: { email: string }): Observable<any> {
  return this.http.post(
    `${this.baseUrl}Common/sendEmailForReg`,
    payload
  );
}

  getEmailByAccessId(accessId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Common/EmailIdByAccessId`, {
      params: { accessId}
    });
  }

}
