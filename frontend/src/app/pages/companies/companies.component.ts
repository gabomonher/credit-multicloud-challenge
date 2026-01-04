import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../core/services/company.service';
import { Company } from '../../core/models/company.model';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Gestión de Empresas</h1>
        <p class="page-subtitle">Administra el portafolio de empresas registradas</p>
      </div>

      <div class="grid grid-cols-3">
        <!-- Formulario -->
        <div class="card">
          <div class="card-header card-header-primary">
            <h2 style="margin: 0; font-size: 1.125rem;">Nueva Empresa</h2>
            <p style="margin: 0.25rem 0 0; opacity: 0.9; font-size: 0.875rem;">Registrar en el sistema</p>
          </div>
          
          <div class="card-body">
            <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label">Nombre de la empresa</label>
                <input type="text" formControlName="name" class="form-input" placeholder="Ej: Acme Corporation">
              </div>
              
              <div class="form-group">
                <label class="form-label">NIT / Tax ID</label>
                <input type="text" formControlName="taxId" class="form-input" placeholder="Identificación fiscal">
              </div>
              
              <div class="form-group">
                <label class="form-label">Sector</label>
                <select formControlName="sector" class="form-select">
                  <option value="">Seleccionar sector</option>
                  <option value="Technology">Tecnología</option>
                  <option value="Finance">Finanzas</option>
                  <option value="Healthcare">Salud</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufactura</option>
                  <option value="Energy">Energía</option>
                  <option value="Other">Otro</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Ingresos Anuales (USD)</label>
                <input type="number" formControlName="annualIncome" class="form-input" placeholder="0.00">
              </div>

              <button type="submit" [disabled]="companyForm.invalid || isSubmitting()" class="btn btn-primary btn-block">
                {{ isSubmitting() ? 'Registrando...' : 'Registrar Empresa' }}
              </button>
            </form>
            
            @if (errorMessage()) {
              <div class="alert alert-error">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ errorMessage() }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Lista -->
        <div class="card">
          <div class="card-header">
            <h2 style="margin: 0; font-size: 1.125rem; color: #1e293b;">Empresas Registradas</h2>
            <p style="margin: 0.25rem 0 0; color: #64748b; font-size: 0.875rem;">{{ companies().length }} empresas en el sistema</p>
          </div>
          
          @if (isLoading()) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p style="color: #64748b; margin: 0;">Cargando empresas...</p>
            </div>
          } @else if (companies().length === 0) {
            <div class="empty-state">
              <div class="empty-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 class="empty-title">Sin empresas registradas</h3>
              <p class="empty-text">Comienza registrando la primera empresa</p>
            </div>
          } @else {
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Sector</th>
                    <th>Ingresos</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @for (company of companies(); track company.id) {
                    <tr>
                      <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                          <div class="avatar">{{ company.name.substring(0, 2).toUpperCase() }}</div>
                          <div>
                            <div style="font-weight: 600; color: #1e293b;">{{ company.name }}</div>
                            <div style="font-size: 0.875rem; color: #64748b;">{{ company.taxId }}</div>
                          </div>
                        </div>
                      </td>
                      <td><span class="badge badge-sector">{{ company.sector }}</span></td>
                      <td style="font-weight: 600;">\${{ formatNumber(company.annualIncome) }}</td>
                      <td style="text-align: right;">
                        <a [routerLink]="['/companies', company.id]" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                          Ver Historial
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class CompaniesComponent implements OnInit {
  private readonly companyService = inject(CompanyService);
  private readonly fb = inject(FormBuilder);

  companies = signal<Company[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal('');

  companyForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    taxId: ['', Validators.required],
    sector: ['', Validators.required],
    annualIncome: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading.set(true);
    this.companyService.getAll().subscribe({
      next: (companies) => {
        this.companies.set(companies);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.companyForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.companyService.create(this.companyForm.value).subscribe({
      next: () => {
        this.companyForm.reset({ annualIncome: 0, sector: '' });
        this.isSubmitting.set(false);
        this.loadCompanies();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Error al crear la empresa');
      }
    });
  }

  formatNumber(value: string): string {
    return parseFloat(value).toLocaleString('en-US');
  }
}
