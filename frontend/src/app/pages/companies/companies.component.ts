import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../core/services/company.service';
import { Company } from '../../core/models/company.model';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div class="container" (click)="closeFilters($event)">
      <div class="page-header">
        <h1 class="page-title">Gestión de Empresas</h1>
        <p class="page-subtitle">Administra el portafolio de empresas registradas</p>
      </div>

      <div class="grid grid-cols-3">
        <!-- Formulario -->
        <div class="card">
          <div class="card-header card-header-primary">
            <h2 style="margin: 0; font-size: 1.125rem;">Nueva Empresa</h2>
            <p style="margin: 0.25rem 0 0; opacity: 0.8; font-size: 0.875rem;">Registrar en el sistema</p>
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
            <h2 style="margin: 0; font-size: 1.125rem; color: white;">Empresas Registradas</h2>
            <p style="margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.875rem;">{{ filteredCompanies().length }} empresas encontradas</p>
          </div>
          
          @if (isLoading()) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p style="color: var(--text-muted); margin: 0;">Cargando empresas...</p>
            </div>
          } @else {
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>
                      <div class="th-content" (click)="toggleFilter('name', $event)">
                        <span>Empresa</span>
                        <svg class="filter-icon" [class.active]="activeFilter() === 'name' || searchTerm()" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                        </svg>
                      </div>
                      
                      @if (activeFilter() === 'name') {
                        <div class="filter-dropdown" (click)="$event.stopPropagation()">
                          <input 
                            type="text" 
                            class="filter-search" 
                            [ngModel]="searchTerm()" 
                            (ngModelChange)="searchTerm.set($event)"
                            placeholder="Buscar empresa..." 
                            autofocus>
                        </div>
                      }
                    </th>
                    <th>
                      <div class="th-content" (click)="toggleFilter('sector', $event)">
                        <span>Sector</span>
                        <svg class="filter-icon" [class.active]="activeFilter() === 'sector' || selectedSectors().length > 0" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                        </svg>
                      </div>

                      @if (activeFilter() === 'sector') {
                        <div class="filter-dropdown" (click)="$event.stopPropagation()">
                          <div class="filter-list">
                            @for (sector of uniqueSectors(); track sector) {
                              <label class="filter-option">
                                <input 
                                  type="checkbox" 
                                  [checked]="selectedSectors().includes(sector)"
                                  (change)="toggleSector(sector)">
                                <span>{{ sector }}</span>
                              </label>
                            }
                          </div>
                          <div class="filter-actions">
                            <button class="filter-btn-link" (click)="selectedSectors.set([])">Limpiar</button>
                          </div>
                        </div>
                      }
                    </th>
                    <th>Ingresos</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @if (filteredCompanies().length === 0) {
                    <tr>
                      <td colspan="4" style="padding: 3rem; text-align: center;">
                        <div class="empty-state" style="border: none; box-shadow: none; padding: 0;">
                          <div class="empty-icon" style="margin: 0 auto 1rem;">
                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                          </div>
                          <h3 class="empty-title">No se encontraron empresas</h3>
                          <p class="empty-text">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                      </td>
                    </tr>
                  } @else {
                    @for (company of filteredCompanies(); track company.id) {
                      <tr>
                        <td>
                          <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div class="avatar">{{ company.name.substring(0, 2).toUpperCase() }}</div>
                            <div>
                              <div style="font-weight: 600; color: white;">{{ company.name }}</div>
                              <div style="font-size: 0.875rem; color: var(--text-muted);">{{ company.taxId }}</div>
                            </div>
                          </div>
                        </td>
                        <td><span class="badge badge-sector">{{ company.sector }}</span></td>
                        <td style="font-weight: 600; color: var(--secondary);">\${{ formatNumber(company.annualIncome) }}</td>
                        <td style="text-align: right;">
                          <a [routerLink]="['/companies', company.id]" class="btn btn-outline btn-sm">
                            Ver Historial
                          </a>
                        </td>
                      </tr>
                    }
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

  // Filters
  activeFilter = signal<string | null>(null);
  searchTerm = signal('');
  selectedSectors = signal<string[]>([]);

  uniqueSectors = computed(() => {
    const sectors = new Set(this.companies().map(c => c.sector));
    return Array.from(sectors).sort();
  });

  filteredCompanies = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const sectors = this.selectedSectors();

    return this.companies().filter(company => {
      const matchesTerm = company.name.toLowerCase().includes(term) ||
        company.taxId.toLowerCase().includes(term);
      const matchesSector = sectors.length === 0 || sectors.includes(company.sector);

      return matchesTerm && matchesSector;
    });
  });

  companyForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    taxId: ['', Validators.required],
    sector: ['', Validators.required],
    annualIncome: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.loadCompanies();
  }

  toggleFilter(filterName: string, event: Event): void {
    event.stopPropagation();
    if (this.activeFilter() === filterName) {
      this.activeFilter.set(null);
    } else {
      this.activeFilter.set(filterName);
    }
  }

  closeFilters(event: Event): void {
    // Check if click is outside any dropdown
    this.activeFilter.set(null);
  }

  toggleSector(sector: string): void {
    this.selectedSectors.update(current => {
      if (current.includes(sector)) {
        return current.filter(s => s !== sector);
      } else {
        return [...current, sector];
      }
    });
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
