function logger(req, res, next) {
  const mulai = process.hrtime.bigint();

  res.on('finish', () => {
    const selesai = process.hrtime.bigint();
    const durasiMs = Number(selesai - mulai) / 1_000_000;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${durasiMs.toFixed(2)} ms)`);
  });

  next();
}

module.exports = logger;
