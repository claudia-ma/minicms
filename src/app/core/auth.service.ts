import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // Por si el backend devuelve otros nombres
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
    map((res: any) => {
      const token =
        res?.token ||
        res?.access_token ||
        res?.data?.token ||
        res?.data?.access_token;

      if (!token) {
        throw new Error('Login OK pero el backend no devolvió token');
      }

      localStorage.setItem(this.tokenKey, token);

      const user = res?.user || res?.data?.user;

      return { token, user };
    })
  );
  }

  me(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.api.baseUrl}/auth/me`);
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.api.baseUrl}/auth/logout`, {})
      .pipe(tap(() => localStorage.removeItem(this.tokenKey)));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}