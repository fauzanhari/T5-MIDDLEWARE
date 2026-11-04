const bukuService = require('../services/bukuService');

async function daftarBuku(req, res, next) {
  try {
    const hasil = await bukuService.ambilSemuaBuku(req.query.kategori);
    res.status(200).json({ data: hasil });
  } catch (err) { next(err); }
}

async function detailBuku(req, res, next) {
  try {
    const hasil = await bukuService.ambilBukuBerdasarkanId(req.params.id);
    res.status(200).json({ data: hasil });
  } catch (err) { next(err); }
}

async function buatBuku(req, res, next) {
  try {
    const hasil = await bukuService.tambahBuku(req.body);
    res.status(201).json({ pesan: 'Buku berhasil ditambahkan', data: hasil });
  } catch (err) { next(err); }
}

async function hapusBuku(req, res, next) {
  try {
    await bukuService.hapusBuku(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
}

async function perbaruiBuku(req, res, next) {
  try {
    const hasil = await bukuService.ubahBuku(req.params.id, req.body);
    res.status(200).json({ pesan: 'Data buku berhasil diperbarui', data: hasil });
  } catch (err) { next(err); }
}

module.exports = { daftarBuku, detailBuku, buatBuku, hapusBuku, perbaruiBuku };
