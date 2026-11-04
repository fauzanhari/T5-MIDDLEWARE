# Tugas 5 - Middleware & Error Terpusat

## Identitas

- Nama: **FAUZAN HARI RAMDANI**
- NIM: **[Isi NIM yang berakhiran 9]**
- Varian: **A - Perpustakaan (`/buku`)**

> NIM berakhiran 9 termasuk digit ganjil, sehingga menggunakan Varian A. Silakan lengkapi identitas sebelum dikumpulkan.

## Cara Menjalankan

1. Pastikan Node.js dan npm sudah terpasang.
2. Buka terminal pada folder proyek, lalu jalankan:
   ```bash
   npm install
   npm run dev
   ```
3. Atur API key pada file `.env`:
   ```env
   API_KEY=perpus_unram_keren
   PORT=3000
   ```
4. Server berjalan di `http://localhost:3000`.
5. Jalankan permintaan pada `requests.http` menggunakan ekstensi REST Client di VS Code.

API key dibaca dari `process.env.API_KEY` (bonus environment variable). Jika variabel `API_KEY` tidak diatur, middleware akan menolak seluruh permintaan POST, PUT, dan DELETE dengan status 401. GET tetap dapat digunakan. File `.env` tidak disertakan ke Git karena tercantum dalam `.gitignore`; gunakan `.env.example` sebagai pola konfigurasi.

## Struktur Proyek

```text
T5-MIDDLEWARE-ERROR-NIM9/
├── controllers/
│   └── bukuController.js
├── data/
│   └── buku.js
├── middlewares/
│   ├── cekApiKey.js
│   ├── errorHandler.js
│   ├── logger.js
│   └── notFound.js
├── routes/
│   └── bukuRoutes.js
├── services/
│   └── bukuService.js
├── validators/
│   └── bukuValidator.js
├── utils/
│   └── AppError.js
├── screenshot/
├── .env.example
├── .gitignore
├── index.js
├── package.json
├── README.md
└── requests.http
```

- `routes/`: mendefinisikan endpoint dan urutan middleware.
- `controllers/`: menerima request, memanggil service, dan membentuk response.
- `services/`: menjalankan aturan bisnis serta operasi data secara asynchronous tanpa mengakses `req` atau `res`.
- `data/`: menyimpan data awal buku.
- `middlewares/`: mencatat request, memeriksa API key, menangani rute yang tidak ditemukan, dan memusatkan error.
- `validators/`: mendefinisikan validasi Joi dan mengumpulkan seluruh kesalahan validasi.
- `utils/`: menyediakan kelas `AppError` untuk error operasional.

## Endpoint

| Method | URL                    | Middleware                  | Hasil                            |
| ------ | ---------------------- | --------------------------- | -------------------------------- |
| GET    | `/buku`                | logger                      | 200, daftar buku                 |
| GET    | `/buku?kategori=sains` | logger                      | 200, daftar terfilter            |
| GET    | `/buku/:id`            | logger                      | 200 atau 404 `NOT_FOUND`         |
| POST   | `/buku`                | logger, cekApiKey, validasi | 201, 401, 422, atau 409          |
| DELETE | `/buku/:id`            | logger, cekApiKey           | 204 atau 401/404                 |
| PUT    | `/buku/:id`            | logger, cekApiKey, validasi | 200 atau 401/404/409/422 (bonus) |

Router dipasang pada `index.js` menggunakan `app.use('/buku', bukuRoutes)`. Karena itu, file router hanya mendefinisikan path relatif `/` dan `/:id`, tanpa mengulang awalan `/buku`.

## Aturan Validasi, Aturan Bisnis, dan Kode Error

Validasi dilakukan menggunakan Joi dengan opsi `abortEarly: false`, sehingga semua kesalahan dikembalikan dalam satu response.

| Field      | Aturan                                                  |
| ---------- | ------------------------------------------------------- |
| `judul`    | String, 3-100 karakter, wajib                           |
| `penulis`  | String, minimal 3 karakter, wajib                       |
| `tahun`    | Bilangan bulat 1900-2026, wajib                         |
| `stok`     | Bilangan bulat 0-100, default 1                         |
| `kategori` | Wajib, salah satu: `novel`, `sains`, `sejarah`, `agama` |

Aturan judul duplikat diletakkan di service, bukan di skema Joi, karena pemeriksaan tersebut membutuhkan pembandingan dengan data yang sudah tersimpan. Pembandingan mengabaikan huruf besar/kecil. Jika judul telah digunakan, service menghasilkan status 409 dengan kode `JUDUL_DUPLIKAT`.

Kode error yang digunakan:

- `UNAUTHORIZED`: API key kosong, salah, atau konfigurasi server belum tersedia (401).
- `VALIDATION_ERROR`: data tidak memenuhi skema Joi (422).
- `JUDUL_DUPLIKAT`: judul buku sudah terdaftar (409).
- `NOT_FOUND`: data buku berdasarkan ID tidak ditemukan (404).
- `ROUTE_NOT_FOUND`: URL tidak memiliki rute yang sesuai (404).
- `INTERNAL_SERVER_ERROR`: kesalahan tak terduga pada server (500).

Semua error menggunakan format `{ "error": { "pesan": "...", "kode": "..." } }`. Detail stack trace hanya dicatat di terminal untuk error 500, bukan dikirim kepada klien.

## Pengujian

Daftar skenario tersedia di `requests.http` (minimal 10 request, di sini disediakan 13 request termasuk bonus PUT).

Simpan tangkapan layar hasil pengujian nyata ke folder `screenshot/`. Berkas gambar tidak dibuat otomatis karena harus berasal dari eksekusi API di komputer dan REST Client milik mahasiswa.

| Nama berkas yang disarankan       | Keterangan                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| `01-log-server.png`               | Terminal menampilkan logger dengan status 404, 401, 422, 201, dan 204.                     |
| `02-detail-buku-404.png`          | GET detail buku dengan ID yang tidak tersedia menghasilkan 404 `NOT_FOUND`.                |
| `03-rute-tidak-dikenal.png`       | URL yang tidak terdaftar menghasilkan 404 `ROUTE_NOT_FOUND`.                               |
| `04-api-key-401.png`              | POST tanpa API key menghasilkan 401.                                                       |
| `05-validasi-422.png`             | POST dengan beberapa field tidak valid menghasilkan 422 dan seluruh rincian validasi.      |
| `06-judul-duplikat-409.png`       | POST judul yang sama dengan data awal menghasilkan 409.                                    |
| `07-tambah-buku-201.png`          | POST dengan data valid menghasilkan 201.                                                   |
| `08-hapus-buku-204.png`           | DELETE buku yang tersedia menghasilkan 204 tanpa body.                                     |
| `09-error-500-klien-terminal.png` | Bukti error 500 di sisi klien dan stack trace di terminal setelah uji kesalahan sementara. |
| `10-requests-http.png`            | Tampilan file `requests.http` di VS Code.                                                  |
| `11-put-bonus-200.png`            | Bukti PUT berhasil (bonus opsional).                                                       |

### Prosedur uji error 500

Sesuai instruksi tugas, lakukan uji ini secara sementara: ubah pemanggilan `koleksiBuku.push(bukuBaru)` di `services/bukuService.js` menjadi pemanggilan yang salah, misalnya `koleksiBuku.dorong(bukuBaru)`. Kirim POST valid. Pastikan klien menerima pesan umum `Terjadi kesalahan pada server` dan terminal menampilkan stack trace. **Segera kembalikan `dorong` menjadi `push` setelah mengambil screenshot. Jangan commit kode yang sengaja dirusak.**

## Deklarasi Penggunaan AI

Contoh deklarasi awal berikut perlu disesuaikan agar benar-benar mencerminkan proses pengerjaan yang dilakukan. Jangan menyatakan telah menguji atau mengubah bagian tertentu sebelum benar-benar melakukannya.

| Bagian                                         | Alat AI   | Dipakai untuk apa                                                                 | Cara memeriksa hasil                                                                                                                           |
| ---------------------------------------------- | --------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Kerangka awal proyek dan pemisahan empat lapis | ChatGPT   | Membantu menyusun contoh struktur folder, route, controller, service, dan data    | Menjalankan server, membaca alur pemanggilan, serta menguji endpoint melalui `requests.http`                                                   |
| Skema Joi dan middleware error                 | ChatGPT   | Membantu menyusun contoh validasi, pemeriksaan API key, dan format error terpusat | Mengirim data valid/tidak valid, API key salah, ID tidak ada, dan URL tidak dikenal; membandingkan status serta body response dengan ketentuan |
| Aturan bisnis judul duplikat                   | ChatGPT   | Memberi contoh logika pembandingan judul tanpa membedakan kapitalisasi            | Menguji judul yang sama dengan variasi huruf besar/kecil dan memastikan status 409                                                             |
| Pengujian, penyesuaian, dan screenshot         | Mahasiswa | Menjalankan proyek dan mengamati hasil pada perangkat sendiri                     | Melampirkan screenshot hasil eksekusi nyata dan memperbaiki bila hasil belum sesuai                                                            |

Contoh prompt yang digunakan: “Bantu buat API Express Varian A Perpustakaan sesuai ketentuan Tugas 5, dengan struktur empat lapis, Joi `abortEarly: false`, middleware API key, dan error terpusat. Jangan mengubah nama field, endpoint, status, atau kode error yang diwajibkan.”

Pernyataan: Saya menggunakan ChatGPT sebagai alat bantu pada bagian yang dicantumkan di tabel. Saya tetap perlu mempelajari, menjalankan, menguji, dan memverifikasi kode serta menyesuaikan deklarasi ini dengan kontribusi yang benar-benar saya lakukan.

## Kesimpulan & Kendala

Dengan middleware error terpusat, controller dan service tidak perlu membentuk response error secara terpisah. Error diteruskan menggunakan `next(err)` atau `throw`, lalu ditangani pada satu tempat dengan format response yang seragam. Hal ini memudahkan pemeliharaan dan mencegah detail internal server bocor kepada klien.

Kendala yang mungkin ditemui adalah API key tidak terbaca, urutan middleware keliru, atau request tidak diteruskan. Periksa file `.env`, pastikan `dotenv` dimuat sebelum middleware digunakan, periksa urutan `cekApiKey` lalu validasi lalu controller, serta pastikan middleware meneruskan alur dengan `next()`.
