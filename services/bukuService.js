const koleksiBuku = require("../data/buku");
const AppError = require("../utils/AppError");

async function ambilSemuaBuku(kategori) {
  if (!kategori) return [...koleksiBuku];
  return koleksiBuku.filter(
    (buku) => buku.kategori.toLowerCase() === String(kategori).toLowerCase()
  );
}

async function ambilBukuBerdasarkanId(id) {
  const buku = koleksiBuku.find((item) => item.id === Number(id));
  if (!buku) throw new AppError(404, "Buku tidak ditemukan", "NOT_FOUND");
  return buku;
}

async function tambahBuku(dataBuku) {
  const judulSama = koleksiBuku.some(
    (item) => item.judul.toLowerCase() === dataBuku.judul.toLowerCase()
  );
  if (judulSama)
    throw new AppError(409, "Judul buku sudah terdaftar", "JUDUL_DUPLIKAT");

  const idBaru = koleksiBuku.length
    ? Math.max(...koleksiBuku.map((item) => item.id)) + 1
    : 1;
  const bukuBaru = { id: idBaru, ...dataBuku };
  koleksiBuku.push(bukuBaru);
  return bukuBaru;
}

async function hapusBuku(id) {
  const posisi = koleksiBuku.findIndex((item) => item.id === Number(id));
  if (posisi === -1)
    throw new AppError(404, "Buku tidak ditemukan", "NOT_FOUND");
  koleksiBuku.splice(posisi, 1);
}

async function ubahBuku(id, dataBuku) {
  const posisi = koleksiBuku.findIndex((item) => item.id === Number(id));
  if (posisi === -1)
    throw new AppError(404, "Buku tidak ditemukan", "NOT_FOUND");

  const judulKembar = koleksiBuku.some(
    (item, index) =>
      index !== posisi &&
      item.judul.toLowerCase() === dataBuku.judul.toLowerCase()
  );
  if (judulKembar)
    throw new AppError(409, "Judul buku sudah terdaftar", "JUDUL_DUPLIKAT");

  koleksiBuku[posisi] = { id: Number(id), ...dataBuku };
  return koleksiBuku[posisi];
}

module.exports = {
  ambilSemuaBuku,
  ambilBukuBerdasarkanId,
  tambahBuku,
  hapusBuku,
  ubahBuku,
};
