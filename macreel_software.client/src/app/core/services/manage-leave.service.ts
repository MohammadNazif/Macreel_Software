import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class ManageLeaveService {
  private readonly baseUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) { }

  // GET ALL (pagination + search)
  getAllLeave(searchTerm?: string, pageNumber?: number, pageSize?: number) {
    let params = new HttpParams();

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    if (pageNumber !== null && pageNumber !== undefined) {
      params = params.set('pageNumber', pageNumber.toString());
    }

    if (pageSize !== null && pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }
    return this.http.get<any>(
      `${this.baseUrl}Common/getAllLeave`, { params: params, withCredentials: true }
    );
  }
  // GET BY ID
  getLeaveById(id: number) {
    return this.http.get<any>(
      `${this.baseUrl}Admin/getLeaveById?id=${id}`
    );
  }
  // INSERT / UPDATE
  insertLeave(data: any) {
    return this.http.post<any>(
      `${this.baseUrl}Admin/insertLeave`,
      data
    );
  }
  // DELETE
  deleteLeaveById(id: number) {
    return this.http.delete<any>(
      `${this.baseUrl}Admin/DeleteLeaveById?id=${id}`
    );
  }
  assignLeaveToEmployee(data: any) {
    return this.http.post<any>(
      `${this.baseUrl}Admin/AssignLeave`,
      data
    );
  }
  // GET ASSIGNED LEAVE FOR EMPLOYEE
  getAssignedLeaveById(empId: number) {
    return this.http.get<any>(`${this.baseUrl}Admin/getAssignedLeaveById?empId=${empId}`);
  }
  // Update Leave Requests
  UpdateLeaveStatus(id:number,leaveCount:number,status:number) {
    return this.http.put<any>(
      `${this.baseUrl}Admin/updateLeaveStatus?id=${id}&leaveCount=${leaveCount}&status=${status}`,{withCredential:true}
    );
  }
  //Leave Requests
  getAllLeaveRequests(searchTerm?: string, pageNumber?: number, pageSize?: number): Observable<any> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    if (pageNumber !== null && pageNumber !== undefined) {
      params = params.set('pageNumber', pageNumber.toString());
    }

    if (pageSize !== null && pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.get<any>(`${this.baseUrl}Admin/getAllLeaveRequests`, { params, withCredentials: true });
  }

  getAllAssignedLeave(searchTerm?: string, pageNumber?: number, pageSize?: number): Observable<any> {
  let params = new HttpParams();

  if (searchTerm) {
    params = params.set('searchTerm', searchTerm);
  }

  if (pageNumber !== null && pageNumber !== undefined) {
    params = params.set('pageNumber', pageNumber.toString());
  }

  if (pageSize !== null && pageSize !== undefined) {
    params = params.set('pageSize', pageSize.toString());
  }

  return this.http.get<any>(
    `${this.baseUrl}Admin/getAllAssignLeave`,
    { params }
  );
}



  //Employee Service Start Here
  getLeaveBalance(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}Employee/allAssignedLeavesByEmpCode`
    );
  }
  applyLeave(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}Employee/insertApplyLeaveByEmpId`, data, { withCredentials: true });
  }
  getAppliedLeaves(searchTerm?: string, pageNumber?: number, pageSize?: number): Observable<any> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    if (pageNumber !== null && pageNumber !== undefined) {
      params = params.set('pageNumber', pageNumber.toString());
    }

    if (pageSize !== null && pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.get<any>(`${this.baseUrl}Employee/ApplyLeaveListByEmpId`, { params, withCredentials: true });
  }
  getAssignedLeaves(searchTerm?: string, pageNumber?: number, pageSize?: number): Observable<any> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    if (pageNumber !== null && pageNumber !== undefined) {
      params = params.set('pageNumber', pageNumber.toString());
    }

    if (pageSize !== null && pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }

    return this.http.get<any>(`${this.baseUrl}Employee/AssignedLeaveListByEmpId`, { params, withCredentials: true });
  }
  getApplyLeaveDetailsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Employee/getApplyLeaveById?id=${id}`, { withCredentials: true });
  }
  //Employee Service End Here

}