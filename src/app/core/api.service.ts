import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly baseUrl = 'https://minicms-of6c.onrender.com/api';
}