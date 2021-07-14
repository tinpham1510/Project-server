var express = require('express');
var router = express.Router();

var authRouter = require('./auth');
var nguoiDungRouter = require('./nguoiDung');
var sanPhamRouter = require('./sanPham');
var loaiSanPhamRouter = require('./loaiSanPham');
var gioHangRouter = require('./gioHang');
var donHangRouter = require('./donHang');
var baoCaoRouter = require('./baoCao');

const { ensureAuthenticated } = require('../../config/auth-config');

router.use('/nguoi-dung', nguoiDungRouter);
router.use('/auth', authRouter);
router.use('/san-pham', sanPhamRouter);
router.use('/loai-san-pham', loaiSanPhamRouter);
router.use('/gio-hang', ensureAuthenticated, gioHangRouter);
router.use('/don-hang', ensureAuthenticated, donHangRouter);
router.use('/bao-cao', baoCaoRouter);
router.get('/', (req, res) => {
    res.status(403).send('Forbidden Route');
});

module.exports = router;