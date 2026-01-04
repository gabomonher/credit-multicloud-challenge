import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, CreateCompanyDto } from '../models/company.model';
import { CompanyCreditsResponse } from '../models/credit.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/companies';

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  getCreditsById(id: string): Observable<CompanyCreditsResponse> {
    return this.http.get<CompanyCreditsResponse>(`${this.apiUrl}/${id}/credits`);
  }

  create(data: CreateCompanyDto): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, data);
  }
}

