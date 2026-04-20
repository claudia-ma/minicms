import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

import { ApiService } from './api.service';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  user?: AuthUser;
  token?: string;
  access_token?: string;
  data?: {
    token?: string;
    access_token?: string;
    user?: AuthUser;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient, private api: ApiService) {}

  login(
    email: string,
    password: string
  ): Observable<{ token: string; user?: AuthUser }> {
    return this.http
      .post<LoginResponse>(`${this.api.baseUrl}/auth/login`, { email, password })
      .pipe(
        map((res) => {
          const token =
            res?.token ||
            res?.access_token ||
            res?.data?.token ||
            res?.data?.access_token;

          if (!token) {
            throw new Error('Login OK pero el backend no devolvió token');
          }

          const user = res?.user || res?.data?.user;

          localStorage.setItem(this.tokenKey, token);

          return { token, user };
        })
      );
  }

  me(): Observable<AuthUser> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<AuthUser>(`${this.api.baseUrl}/auth/me`, { headers });
  }

  logout(): Observable<void> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http
      .post<void>(`${this.api.baseUrl}/auth/logout`, {}, { headers })
      .pipe(tap(() => localStorage.removeItem(this.tokenKey)));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}