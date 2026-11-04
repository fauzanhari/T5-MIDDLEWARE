const Joi = require('joi');

const skemaBuku = Joi.object({
  judul: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Judul harus berupa teks',
    'string.min': 'Judul minimal 3 karakter',
    'string.max': 'Judul maksimal 100 karakter',
    'any.required': 'Judul wajib diisi'
  }),
  penulis: Joi.string().min(3).required().messages({
    'string.base': 'Penulis harus berupa teks',
    'string.min': 'Penulis minimal 3 karakter',
    'any.required': 'Penulis wajib diisi'
  }),
  tahun: Joi.number().integer().min(1900).max(2026).required().messages({
    'number.base': 'Tahun harus berupa angka',
    'number.integer': 'Tahun harus bilangan bulat',
    'number.min': 'Tahun minimal 1900',
    'number.max': 'Tahun maksimal 2026',
    'any.required': 'Tahun wajib diisi'
  }),
  stok: Joi.number().integer().min(0).max(100).default(1).messages({
    'number.base': 'Stok harus berupa angka',
    'number.integer': 'Stok harus bilangan bulat',
    'number.min': 'Stok minimal 0',
    'number.max': 'Stok maksimal 100'
  }),
  kategori: Joi.string().valid('novel', 'sains', 'sejarah', 'agama').required().messages({
    'any.only': 'Kategori harus novel, sains, sejarah, atau agama',
    'any.required': 'Kategori wajib diisi'
  })
});

function validasiBuku(req, res, next) {
  const { error, value } = skemaBuku.validate(req.body, { abortEarly: false, convert: true });

  if (error) {
    const rincian = error.details.map((item) => item.message);
    return next(Object.assign(new Error('Data buku tidak memenuhi aturan validasi'), {
      statusCode: 422,
      kode: 'VALIDATION_ERROR',
      rincian
    }));
  }

  req.body = value;
  next();
}

module.exports = { skemaBuku, validasiBuku };
