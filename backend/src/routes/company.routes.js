const express = require('express');
const { createCompany, listCompanies, listCompanyCredits } = require('../controllers/company.controller');

const router = express.Router();

router.post('/', createCompany);
router.get('/', listCompanies);
router.get('/:id/credits', listCompanyCredits);

module.exports = router;
