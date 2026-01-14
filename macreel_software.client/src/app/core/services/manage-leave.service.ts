import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageLeaveService {

  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

insertLeave(data: any) {
  return this.http.post<any>(
    `${this.baseUrl}Admin/insertLeave`,
    data
  );
}

}
