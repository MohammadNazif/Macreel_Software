import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageEmployeeService {

  constructor(
     private http: HttpClient
  ) { }
  private baseUrl: string = environment.apiUrl
  private readonly token: string | null = "Get Token";

    Addemployee(role: any) {
    // const headers = new HttpHeaders({
    //   'Authorization' : `Bearer ${this.token}`
    // })
    return this.http.post(`${this.baseUrl}Admin/insertEmployeeRegistration`, role, {})
  }
}
