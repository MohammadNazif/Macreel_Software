import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

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
  getAllLeave(searchTerm = '', pageNumber = 1, pageSize = 10) {
    return this.http.get<any>(
      `${this.baseUrl}Admin/getAllLeave?searchTerm=${searchTerm}&pageNumber=${pageNumber}&pageSize=${pageSize}`
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

}