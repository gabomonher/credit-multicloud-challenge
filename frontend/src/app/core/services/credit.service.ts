import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credit, CreateCreditDto } from '../models/credit.model';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/credits';

  getAll(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl);
  }

  create(data: CreateCreditDto): Observable<Credit> {
    return this.http.post<Credit>(this.apiUrl, data);
  }
}

