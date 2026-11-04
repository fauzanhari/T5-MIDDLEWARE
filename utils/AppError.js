class AppError extends Error {
  constructor(statusCode, pesan, kode) {
    super(pesan);
    this.statusCode = statusCode;
    this.kode = kode;
    this.isOperational = true;
  }
}

module.exports = AppError;
