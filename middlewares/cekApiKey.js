const AppError = require('../utils/AppError');

function cekApiKey(req, res, next) {
  const kunciDariKlien = req.get('x-api-key');
  const kunciServer = process.env.API_KEY;

  if (!kunciServer || !kunciDariKlien || kunciDariKlien !== kunciServer) {
    return next(new AppError(401, 'API key tidak valid atau belum diberikan', 'UNAUTHORIZED'));
  }

  next();
}

module.exports = cekApiKey;
