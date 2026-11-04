require('dotenv').config();
const express = require('express');
const bukuRoutes = require('./routes/bukuRoutes');
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);
app.use('/buku', bukuRoutes);
app.use(notFound);
app.use(errorHandler); // Harus menjadi middleware paling akhir.

app.listen(port, () => {
  console.log(`Server Perpustakaan berjalan di http://localhost:${port}`);
  if (!process.env.API_KEY) {
    console.warn('Peringatan: API_KEY belum diatur. Endpoint POST, PUT, dan DELETE akan menolak semua permintaan.');
  }
});
