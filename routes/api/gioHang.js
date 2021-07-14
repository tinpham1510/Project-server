var express = require('express');
var router = express.Router();
var { db, auth, firebaseApp, FieldValue } = require('../../config/firebase-config');
var { ensureAuthenticated } = require('../../config/auth-config');

var validator = require('../../config/validator-config');
const gioHangSchema = require('../../schemas/gioHangSchema');
/**
 * @swagger
 * tags:
 *  name: GioHang
 *  description: Giỏ hàng
 */

/**
 * @swagger
 * /api/gio-hang:
 *  get:
 *      summary: Lấy thông tin giỏ hàng
 *      tags: [GioHang]
 *      responses:
 *          200:
 *              description: Danh sách sản phẩm trong giỏ hàng
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  description: Trạng thái trả về
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          ma_san_pham: 
 *                                              type: string
 *                                          ten_san_pham: 
 *                                              type: string
 *                                          so_luong_mua:
 *                                              type: number
 *                                          gia_tien: 
 *                                              type: number
 *  
 */
router.get('/', async (req, res) => {
    try {
        var collectionGioHang = db.collection('NguoiDung').doc(req.user.uid).collection('gio-hang');
        var collectionSanPham = db.collection('SanPham');
        var gioHang = await collectionGioHang.get();
        let data = [];
        for (var gioHangItem of gioHang.docs) {
            let item = gioHangItem.data();
            let sanPham = await collectionSanPham.doc(item.ma_san_pham).get();
            item.ten_san_pham = sanPham.data()?.ten_san_pham;
            item.gia_tien = sanPham.data()?.gia_tien;
            data.push(item);
        }
        return res.json({ success: true, data: data });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/gio-hang:
 *  post:
 *      summary: Thêm sản phẩm vào giỏ hàng
 *      tags: [GioHang]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ma_san_pham: 
 *                             type: string
 *                         so_luong:
 *                             type: integer
 *                      required:
 *                          ma_san_pham
 *                          so_luong
 *      responses:
 *          200:
 *              description: Thông tin sản phẩm đã thêm
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Trạng thái trả về
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          ma_san_pham: 
 *                                              type: string
 *                                          so_luong:
 *                                              type: number
 */
router.post('/', validator(gioHangSchema), async (req, res) => {
    try {
        var collectionGioHang = db.collection('NguoiDung').doc(req.user.uid).collection('gio-hang');
        var currentSanPham = await collectionGioHang.where('ma_san_pham', '==', req.body.ma_san_pham).get();
        if (currentSanPham.empty) {
            var insertSanPham = {
                ma_san_pham: req.body.ma_san_pham,
                so_luong: req.body.so_luong
            }
            await collectionGioHang.add(insertSanPham);
            return res.json({ success: true, data: insertSanPham });
        }
        else {
            var updateSanPham = (await collectionGioHang.where('ma_san_pham', '==', req.body.ma_san_pham).get())[0];
            updateSanPham.update({ so_luong: FieldValue.increment(req.body.so_luong) });
            return res.json({ success: true, data: updateSanPham.data() })
        }
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/gio-hang:
 *  put:
 *      summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *      tags: [GioHang]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ma_san_pham: 
 *                             type: string
 *                         so_luong:
 *                             type: integer
 *                      required:
 *                          ma_san_pham
 *                          so_luong
 *      responses:
 *          200:
 *              description: Thông tin sản phẩm đã thêm
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Trạng thái trả về
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          ma_san_pham: 
 *                                              type: string
 *                                          so_luong:
 *                                              type: number
 */
router.put('/', validator(gioHangSchema), async (req, res) => {
    try {
        var collectionGioHang = db.collection('NguoiDung').doc(req.user.uid).collection('gio-hang');
        var currentSanPham = await collectionGioHang.where('ma_san_pham', '==', req.body.ma_san_pham).get();
        if (currentSanPham.empty) {
            var insertSanPham = {
                ma_san_pham: req.body.ma_san_pham,
                so_luong: req.body.so_luong
            }
            await collectionGioHang.add(insertSanPham);
            return res.json({ success: true, data: insertSanPham });
        }
        else {
            var updateSanPham = currentSanPham.docs[0];
            updateSanPham.ref.update({ so_luong: req.body.so_luong });
            return res.json({ success: true, data: insertSanPham });
        }
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/gio-hang:
 *  delete:
 *      summary: Xoá sản phẩm khỏi giỏ hàng
 *      tags: [GioHang]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ma_san_pham:
 *                             type: string
 *                      required:
 *                          ma_san_pham
 *      responses:
 *          200:
 *              description: Mã sản phẩm đã xoá
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Trạng thái trả về
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          ma_san_pham: 
 *                                              type: string
 */
router.delete('/', async (req, res) => {
    try {
        var collectionGioHang = db.collection('NguoiDung').doc(req.user.uid).collection('gio-hang');
        var data = await collectionGioHang.where('ma_san_pham', '==', req.body.ma_san_pham).get();
        if (!data.empty) {
            data.docs.forEach((doc) => doc.ref.delete());
        }
        return res.json({ success: true, data: { ma_san_pham: req.body.ma_san_pham } });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/gio-hang/thanh-toan:
 *  post:
 *      summary: Thanh toán
 *      tags: [GioHang]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ten_nguoi_nhan:
 *                             type: string
 *                         so_dien_thoai:
 *                             type: string
 *                         dia_chi:
 *                             type: string
 *                         email:
 *                             type: string
 *                      required:
 *                          ten_nguoi_nhan
 *                          so_dien_thoai
 *                          dia_chi
 *                          email
 *      responses:
 *          200:
 *              description: Mã đơn hàng
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Trạng thái trả về
 */
router.post('/thanh-toan', async (req, res) => {
    try {
        var collectionGioHang = db.collection('NguoiDung').doc(req.user.uid).collection('gio-hang');
        var collectionDonHang = db.collection('DonHang');
        var collectionSanPham = db.collection('SanPham');
        var listSanPham = await collectionGioHang.get();
        var arrSanPhamDonHang = [];
        for (var sanPham of listSanPham.docs) {
            let item = sanPham.data();
            let sanPhamRef = await collectionSanPham.doc(item.ma_san_pham).get();
            item.gia_tien = sanPhamRef.data().gia_tien;
            arrSanPhamDonHang.push(item);
        }
        insertDonHang = {
            ma_nguoi_dung: req.user.uid,
            ten_nguoi_nhan: req.body.ten_nguoi_nhan,
            so_dien_thoai: req.body.so_dien_thoai,
            dia_chi: req.body.dia_chi,
            email: req.body.email,
            san_pham: arrSanPhamDonHang,
            ngay_mua: new Date(),
            tinh_trang_don_hang: 'Đã khởi tạo'
        };
        collectionDonHang.add(insertDonHang);
        const batch = db.batch();
        (await collectionGioHang.get()).docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        return res.json({ success: true });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

module.exports = router;