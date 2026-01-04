const { prisma } = require('../config/prisma');
const { notify } = require('../services/notification.service');

// POST /credits
async function createCredit(req, res) {
  try {
    const { companyId, amount, termMonths } = req.body;

    // Validaciones
    if (!companyId) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'companyId is required'
      });
    }

    const amountNumber = Number(amount);
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'amount must be a number greater than 0'
      });
    }

    const termMonthsNumber = Number(termMonths);
    if (!Number.isInteger(termMonthsNumber) || termMonthsNumber <= 0) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'termMonths must be an integer greater than 0'
      });
    }

    // Verificar que la empresa exista
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({ error: 'company_not_found' });
    }

    // Crear crédito con status PENDING por defecto
    const credit = await prisma.credit.create({
      data: {
        companyId,
        amount: amountNumber,
        termMonths: termMonthsNumber,
        status: 'PENDING'
      }
    });

    // Notificar creación
    notify('credit.created', {
      creditId: credit.id,
      companyId: credit.companyId,
      amount: credit.amount.toString(),
      termMonths: credit.termMonths
    });

    return res.status(201).json(credit);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}

// GET /credits
async function listCredits(req, res) {
  try {
    const credits = await prisma.credit.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
            taxId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(credits);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}

module.exports = { createCredit, listCredits };

