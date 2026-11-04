function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const pesan = statusCode === 500 ? 'Terjadi kesalahan pada server' : err.message;
  const kode = err.kode || 'INTERNAL_SERVER_ERROR';

  if (statusCode === 500) {
    console.error('Kesalahan internal:', err.stack);
  }

  const detailError = { pesan, kode };
  if (err.rincian) detailError.rincian = err.rincian;
  res.status(statusCode).json({ error: detailError });
}

module.exports = errorHandler;
