const express = require('express');
const cors = require('cors');

const companyRoutes = require('./routes/company.routes');
const creditRoutes = require('./routes/credit.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de logging para debug - TODAS las peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.method === 'PUT') {
    console.log('  Body:', req.body);
    console.log('  Params:', req.params);
    console.log('  Query:', req.query);
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/companies', companyRoutes);
app.use('/credits', creditRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log('Routes registered:');
  console.log('  POST /credits');
  console.log('  GET /credits');
  console.log('  PUT /credits/:id/status');
});
