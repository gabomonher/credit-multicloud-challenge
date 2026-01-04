const express = require('express');
const { createCredit, listCredits, updateCreditStatus } = require('../controllers/credit.controller');

const router = express.Router();

// Middleware para verificar que la ruta se registre
router.use((req, res, next) => {
  if (req.method === 'PUT' && req.path.includes('/status')) {
    console.log('[ROUTER] PUT route matched:', req.path, 'params:', req.params);
  }
  next();
});

// Las rutas más específicas deben ir antes de las genéricas
router.put('/:id/status', (req, res, next) => {
  console.log('[ROUTER] PUT /:id/status handler called, id:', req.params.id);
  next();
}, updateCreditStatus);
router.post('/', createCredit);
router.get('/', listCredits);

console.log('[ROUTER] Credit routes registered:');
console.log('  PUT /:id/status');
console.log('  POST /');
console.log('  GET /');

module.exports = router;

