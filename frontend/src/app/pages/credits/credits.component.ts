import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CreditService } from '../../core/services/credit.service';
import { CompanyService } from '../../core/services/company.service';
import { Credit } from '../../core/models/credit.model';
import { Company } from '../../core/models/company.model';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Centro de Créditos</h1>
        <p class="page-subtitle">Gestiona solicitudes y aprobaciones de crédito</p>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div>
            <div class="stat-label">Total Créditos</div>
            <div class="stat-value">{{ credits().length }}</div>
          </div>
          <div class="stat-icon stat-icon-blue">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        
        <div class="stat-card">
          <div>
            <div class="stat-label">Pendientes</div>
            <div class="stat-value stat-value-secondary">{{ getPendingCount() }}</div>
          </div>
          <div class="stat-icon stat-icon-secondary">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        
        <div class="stat-card">
          <div>
            <div class="stat-label">Monto Total</div>
            <div class="stat-value stat-value-primary">\${{ getTotalAmount() }}</div>
          </div>
          <div class="stat-icon stat-icon-primary">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3">
        <!-- Formulario -->
        <div class="card">
          <div class="card-header card-header-secondary">
            <h2 style="margin: 0; font-size: 1.125rem;">Nueva Solicitud</h2>
            <p style="margin: 0.25rem 0 0; opacity: 0.9; font-size: 0.875rem;">Crear solicitud de crédito</p>
          </div>
          
          <div class="card-body">
            <form [formGroup]="creditForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label class="form-label">Empresa Solicitante</label>
                <select formControlName="companyId" class="form-select">
                  <option value="">Seleccionar empresa</option>
                  @for (company of companies(); track company.id) {
                    <option [value]="company.id">{{ company.name }}</option>
                  }
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Monto Solicitado (USD)</label>
                <input type="number" formControlName="amount" class="form-input" placeholder="0.00">
              </div>
              
              <div class="form-group">
                <label class="form-label">Plazo (meses)</label>
                <select formControlName="termMonths" class="form-select">
                  <option [value]="6">6 meses</option>
                  <option [value]="12">12 meses</option>
                  <option [value]="24">24 meses</option>
                  <option [value]="36">36 meses</option>
                  <option [value]="48">48 meses</option>
                  <option [value]="60">60 meses</option>
                </select>
              </div>

              <button type="submit" [disabled]="creditForm.invalid || isSubmitting()" class="btn btn-secondary btn-block">
                {{ isSubmitting() ? 'Procesando...' : 'Solicitar Crédito' }}
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
            
            @if (successMessage()) {
              <div class="alert alert-success">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ successMessage() }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Lista -->
        <div class="card">
          <div class="card-header">
            <h2 style="margin: 0; font-size: 1.125rem; color: #1e293b;">Solicitudes de Crédito</h2>
            <p style="margin: 0.25rem 0 0; color: #64748b; font-size: 0.875rem;">Historial de operaciones</p>
          </div>
          
          @if (isLoading()) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p style="color: #64748b; margin: 0;">Cargando solicitudes...</p>
            </div>
          } @else if (credits().length === 0) {
            <div class="empty-state">
              <div class="empty-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="empty-title">Sin solicitudes</h3>
              <p class="empty-text">Crea la primera solicitud de crédito</p>
            </div>
          } @else {
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Monto</th>
                    <th>Plazo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  @for (credit of credits(); track credit.id) {
                    <tr>
                      <td>
                        @if (credit.company) {
                          <a [routerLink]="['/companies', credit.companyId]" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: inherit;">
                            <div class="avatar avatar-secondary">{{ credit.company.name.substring(0, 2).toUpperCase() }}</div>
                            <div>
                              <div style="font-weight: 600; color: #1e293b;">{{ credit.company.name }}</div>
                              <div style="font-size: 0.875rem; color: #64748b;">{{ credit.company.taxId }}</div>
                            </div>
                          </a>
                        }
                      </td>
                      <td style="font-weight: 700; font-size: 1.125rem;">\${{ formatNumber(credit.amount) }}</td>
                      <td>{{ credit.termMonths }} meses</td>
                      <td>
                        <span [class]="'badge ' + (credit.status === 'APPROVED' ? 'badge-approved' : 'badge-pending')">
                          {{ credit.status === 'PENDING' ? 'Pendiente' : 'Aprobado' }}
                        </span>
                      </td>
                      <td style="color: #64748b;">{{ formatDate(credit.createdAt) }}</td>
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
export class CreditsComponent implements OnInit {
  private readonly creditService = inject(CreditService);
  private readonly companyService = inject(CompanyService);
  private readonly fb = inject(FormBuilder);

  credits = signal<Credit[]>([]);
  companies = signal<Company[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  creditForm: FormGroup = this.fb.group({
    companyId: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    termMonths: [12, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.loadCredits();
    this.loadCompanies();
  }

  loadCredits(): void {
    this.isLoading.set(true);
    this.creditService.getAll().subscribe({
      next: (credits) => {
        this.credits.set(credits);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: (companies) => {
        this.companies.set(companies);
      }
    });
  }

  onSubmit(): void {
    if (this.creditForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.creditService.create(this.creditForm.value).subscribe({
      next: () => {
        this.creditForm.patchValue({ companyId: '', amount: 0, termMonths: 12 });
        this.isSubmitting.set(false);
        this.successMessage.set('Solicitud creada exitosamente');
        this.loadCredits();
        setTimeout(() => this.successMessage.set(''), 4000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Error al procesar la solicitud');
      }
    });
  }

  formatNumber(value: string): string {
    return parseFloat(value).toLocaleString('en-US');
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getPendingCount(): number {
    return this.credits().filter(c => c.status === 'PENDING').length;
  }

  getTotalAmount(): string {
    const total = this.credits().reduce((sum, credit) => sum + parseFloat(credit.amount), 0);
    return total.toLocaleString('en-US');
  }
}
