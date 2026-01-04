const express = require('express');
const cors = require('cors');

const companyRoutes = require('./routes/company.routes');
const creditRoutes = require('./routes/credit.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/companies', companyRoutes);
app.use('/credits', creditRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
