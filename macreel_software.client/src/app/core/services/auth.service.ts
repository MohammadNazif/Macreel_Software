import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
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

  isTokenValid(): boolean {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.exp) return false;

    // exp is in seconds
    const isExpired = decoded.exp * 1000 < Date.now();
    return !isExpired;
  }

  getRole(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
  }

  logout(){}
}

