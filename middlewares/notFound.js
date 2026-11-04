const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(404, `Rute ${req.method} ${req.originalUrl} tidak ditemukan`, 'ROUTE_NOT_FOUND'));
}

module.exports = notFound;
