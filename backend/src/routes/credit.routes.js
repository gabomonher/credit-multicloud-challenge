const express = require('express');
const { createCredit, listCredits } = require('../controllers/credit.controller');

const router = express.Router();

router.post('/', createCredit);
router.get('/', listCredits);

module.exports = router;

