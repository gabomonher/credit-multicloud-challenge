export interface Company {
  id: string;
  name: string;
  taxId: string;
  sector: string;
  annualIncome: string;
  createdAt: string;
}

export interface CreateCompanyDto {
  name: string;
  taxId: string;
  sector: string;
  annualIncome: number;
}

