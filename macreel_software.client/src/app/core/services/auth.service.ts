import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
  private roleId: string | null = null;
  constructor(
    private readonly http: HttpClient
  ) { }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(userdata: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}Auth/login`, userdata);
  }

  decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token!", error);
      return null;
    }
  }

  setRole(roleId: string) {
    this.roleId = roleId;
  }

  getRole() {
    return this.roleId;
  }

  isTokenValid() { debugger
    return !!this.roleId;
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}Auth/logout`, {}, { withCredentials: true });
  }
  loadUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}Auth/me`, {
      withCredentials: true
    });
  }
}

