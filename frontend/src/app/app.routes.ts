import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/companies',
    pathMatch: 'full'
  },
  {
    path: 'companies',
    loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent)
  },
  {
    path: 'companies/:id',
    loadComponent: () => import('./pages/company-detail/company-detail.component').then(m => m.CompanyDetailComponent)
  },
  {
    path: 'credits',
    loadComponent: () => import('./pages/credits/credits.component').then(m => m.CreditsComponent)
  },
  {
    path: '**',
    redirectTo: '/companies'
  }
];
