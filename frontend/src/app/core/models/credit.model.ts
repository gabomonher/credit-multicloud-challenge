import { Company } from './company.model';

export type CreditStatus = 'PENDING' | 'APPROVED';

export interface Credit {
  id: string;
  amount: string;
  termMonths: number;
  status: CreditStatus;
  createdAt: string;
  companyId: string;
  company?: Pick<Company, 'id' | 'name' | 'taxId'>;
}

export interface CreateCreditDto {
  companyId: string;
  amount: number;
  termMonths: number;
}

export interface CompanyCreditsResponse {
  company: Company;
  credits: Credit[];
}

