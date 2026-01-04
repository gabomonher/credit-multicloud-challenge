import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompanyService } from '../../core/services/company.service';
import { Company } from '../../core/models/company.model';
import { Credit } from '../../core/models/credit.model';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <a routerLink="/companies" class="btn btn-outline" style="margin-bottom: 1.5rem;">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Volver a Empresas
      </a>

      @if (isLoading()) {
        <div class="card">
          <div class="loading-state">
            <div class="spinner"></div>
            <p style="color: var(--text-muted); margin: 0;">Cargando información...</p>
          </div>
        </div>
      } @else if (error()) {
        <div class="alert alert-error" style="margin: 0;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <strong>Error</strong>
            <p style="margin: 0.25rem 0 0;">{{ error() }}</p>
          </div>
        </div>
      } @else if (company()) {
        <!-- Company Header -->
        <div class="company-header">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div class="company-info">
              <div class="company-avatar">{{ company()!.name.substring(0, 2).toUpperCase() }}</div>
              <div>
                <h1 class="company-name">{{ company()!.name }}</h1>
                <div class="company-meta">
                  <span class="company-tag">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                    {{ company()!.taxId }}
                  </span>
                  <span class="company-tag" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.3);">
                    {{ company()!.sector }}
                  </span>
                </div>
              </div>
            </div>
            <a routerLink="/credits" class="btn btn-secondary">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Nuevo Crédito
            </a>
          </div>
          
          <div class="company-stats">
            <div class="company-stat">
              <div class="company-stat-label">Ingresos Anuales</div>
              <div class="company-stat-value">\${{ formatNumber(company()!.annualIncome) }}</div>
            </div>
            <div class="company-stat">
              <div class="company-stat-label">Total Créditos</div>
              <div class="company-stat-value">{{ credits().length }}</div>
            </div>
            <div class="company-stat">
              <div class="company-stat-label">Monto Total</div>
              <div class="company-stat-value" style="color: #34d399;">\${{ getTotalAmount() }}</div>
            </div>
            <div class="company-stat">
              <div class="company-stat-label">Cliente desde</div>
              <div class="company-stat-value">{{ formatShortDate(company()!.createdAt) }}</div>
            </div>
          </div>
        </div>

        <!-- Credits Table -->
        <div class="card">
          <div class="card-header">
            <h2 style="margin: 0; font-size: 1.125rem; color: white;">Historial de Créditos</h2>
            <p style="margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.875rem;">Todas las operaciones de la empresa</p>
          </div>
          
          @if (credits().length === 0) {
            <div class="empty-state">
              <div class="empty-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="empty-title">Sin historial de créditos</h3>
              <p class="empty-text">Esta empresa aún no tiene solicitudes</p>
              <a routerLink="/credits" class="btn btn-primary" style="margin-top: 1rem;">Crear primera solicitud</a>
            </div>
          } @else {
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID Operación</th>
                    <th>Monto</th>
                    <th>Plazo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  @for (credit of credits(); track credit.id) {
                    <tr>
                      <td style="font-family: monospace; color: var(--text-muted);">{{ credit.id.substring(0, 8) }}...</td>
                      <td style="font-weight: 700; font-size: 1.125rem; color: white;">\${{ formatNumber(credit.amount) }}</td>
                      <td><span class="badge badge-sector">{{ credit.termMonths }} meses</span></td>
                      <td>
                        <span [class]="'badge ' + (credit.status === 'APPROVED' ? 'badge-approved' : 'badge-pending')">
                          {{ credit.status === 'PENDING' ? 'Pendiente' : 'Aprobado' }}
                        </span>
                      </td>
                      <td style="color: var(--text-muted);">{{ formatDate(credit.createdAt) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            
            <div style="padding: 1rem 1.5rem; background: rgba(0,0,0,0.2); border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;">
              <div style="display: flex; gap: 1.5rem;">
                <span style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-muted);">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></span>
                  {{ getApprovedCount() }} aprobados
                </span>
                <span style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-muted);">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b;"></span>
                  {{ getPendingCount() }} pendientes
                </span>
              </div>
              <div>
                <span style="color: var(--text-muted); font-size: 0.875rem;">Monto total:</span>
                <span style="font-weight: 700; color: #34d399; margin-left: 0.5rem;">\${{ getTotalAmount() }}</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class CompanyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly companyService = inject(CompanyService);

  company = signal<Company | null>(null);
  credits = signal<Credit[]>([]);
  isLoading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCompanyCredits(id);
    }
  }

  loadCompanyCredits(id: string): void {
    this.isLoading.set(true);
    this.companyService.getCreditsById(id).subscribe({
      next: (response) => {
        this.company.set(response.company);
        this.credits.set(response.credits);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.status === 404 ? 'Empresa no encontrada' : 'Error al cargar la información');
      }
    });
  }

  formatNumber(value: string): string {
    return parseFloat(value).toLocaleString('en-US');
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatShortDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short'
    });
  }

  getTotalAmount(): string {
    const total = this.credits().reduce((sum, credit) => sum + parseFloat(credit.amount), 0);
    return total.toLocaleString('en-US');
  }

  getPendingCount(): number {
    return this.credits().filter(c => c.status === 'PENDING').length;
  }

  getApprovedCount(): number {
    return this.credits().filter(c => c.status === 'APPROVED').length;
  }
}
