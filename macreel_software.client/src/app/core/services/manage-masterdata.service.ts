import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageMasterdataService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl: string = environment.apiUrl
  private readonly token: string | null = "Get Token";

  AddRole(role: any) {
    // const headers = new HttpHeaders({
    //   'Authorization' : `Bearer ${this.token}`
    // })
    return this.http.post(`${this.baseUrl}Master/insertRole`, role, {})
  }

  getRoles(pageNumber: number | null = null, pageSize: number | null = null, searchText: string = '') {
    let params = new HttpParams();

    if (pageNumber !== null) params = params.set('pageNumber', pageNumber);
    if (pageSize !== null) params = params.set('pageSize', pageSize);
    if (searchText) params = params.set('searchTerm', searchText); // your API expects searchTerm

    return this.http.get<any>(`${this.baseUrl}Master/getAllRole`, { params });
  }

  getRoleById(id: number) {
    return this.http.get<any>(`${this.baseUrl}Master/getRoleById?roleId=${id}`);
  }


  deleteRoleById(id: number) {
    return this.http.delete<any>(`${this.baseUrl}Master/deleteRoleById?roleId=${id}`);
  }

  //DESIGANTION RELATED api
  getDesignation(pageNumber: number | null = null, pageSize: number | null = null, searchText: string = '') {
    let params = new HttpParams();

    if (pageNumber !== null) params = params.set('pageNumber', pageNumber);
    if (pageSize !== null) params = params.set('pageSize', pageSize);
    if (searchText) params = params.set('searchTerm', searchText); // your API expects searchTerm

    return this.http.get<any>(`${this.baseUrl}Master/getAllDesignation`, { params });
  }

  addOrUpdateDesignation(role: any) {
    // const headers = new HttpHeaders({
    //   'Authorization' : `Bearer ${this.token}`
    // })
    return this.http.post(`${this.baseUrl}Master/insertDesignation`, role, {})
  }

  getDesignationById(id: number) {
    return this.http.get<any>(`${this.baseUrl}Master/getDesignationById?desId=${id}`);
  }

  deleteDesignationById(id: number) {
    return this.http.delete<any>(`${this.baseUrl}Master/deleteDesignationById?desId=${id}`);
  }

  //Department RELATED api
  getDepartment(pageNumber: number | null = null, pageSize: number | null = null, searchText: string = '') {
    let params = new HttpParams();

    if (pageNumber !== null) params = params.set('pageNumber', pageNumber);
    if (pageSize !== null) params = params.set('pageSize', pageSize);
    if (searchText) params = params.set('searchTerm', searchText); // your API expects searchTerm

    return this.http.get<any>(`${this.baseUrl}Master/getAllDepartment`, { params });
  }

  addOrUpdateDepartment(role: any) {
    // const headers = new HttpHeaders({
    //   'Authorization' : `Bearer ${this.token}`
    // })
    return this.http.post(`${this.baseUrl}Master/insertDepartment`, role, {})
  }

  getDepartmentById(id: number) {
    return this.http.get<any>(`${this.baseUrl}Master/getDepartmentById?depId=${id}`);
  }

  deleteDepartmentById(id: number) {
    return this.http.delete<any>(`${this.baseUrl}Master/deleteDepartmentById?depId=${id}`);
  }

}
