const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuController');
const cekApiKey = require('../middlewares/cekApiKey');
const { validasiBuku } = require('../validators/bukuValidator');

router.get('/', bukuController.daftarBuku);
router.get('/:id', bukuController.detailBuku);
router.post('/', cekApiKey, validasiBuku, bukuController.buatBuku);
router.put('/:id', cekApiKey, validasiBuku, bukuController.perbaruiBuku); // Bonus opsional
router.delete('/:id', cekApiKey, bukuController.hapusBuku);

module.exports = router;
