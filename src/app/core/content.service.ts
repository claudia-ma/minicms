import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Content {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  status: 'draft' | 'published';
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  constructor(private http: HttpClient, private api: ApiService) {}

  // Admin (protegido)
  list(): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.api.baseUrl}/contents`);
  }

  create(payload: Partial<Content>): Observable<Content> {
    return this.http.post<Content>(`${this.api.baseUrl}/contents`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.baseUrl}/contents/${id}`);
  }

  update(id: number, payload: Partial<Content>): Observable<Content> {
  return this.http.put<Content>(`${this.api.baseUrl}/contents/${id}`, payload);
}
}