const { prisma } = require('../config/prisma');

// POST /companies
async function createCompany(req, res) {
  try {
    const { name, taxId, sector, annualIncome } = req.body;

    // Validación mínima (simple y clara)
    if (!name || !taxId || !sector || annualIncome === undefined) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'name, taxId, sector, annualIncome are required'
      });
    }

    const annualIncomeNumber = Number(annualIncome);
    if (Number.isNaN(annualIncomeNumber) || annualIncomeNumber < 0) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'annualIncome must be a non-negative number'
      });
    }

    const company = await prisma.company.create({
      data: {
        name,
        taxId,
        sector,
        annualIncome: annualIncomeNumber
      }
    });

    return res.status(201).json(company);
  } catch (e) {
    // taxId unique (Prisma)
    if (e.code === 'P2002') {
      return res.status(409).json({
        error: 'conflict',
        message: 'taxId already exists'
      });
    }

    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}

// GET /companies
async function listCompanies(req, res) {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return res.json(companies);
}

// GET /companies/:id/credits
async function listCompanyCredits(req, res) {
  try {
    const { id } = req.params;

    // Verificar que la empresa exista
    const company = await prisma.company.findUnique({
      where: { id }
    });

    if (!company) {
      return res.status(404).json({ error: 'company_not_found' });
    }

    // Traer créditos por companyId ordenados por createdAt desc
    const credits = await prisma.credit.findMany({
      where: { companyId: id },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ company, credits });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}

module.exports = { createCompany, listCompanies, listCompanyCredits };
