var express = require('express');
var router = express.Router();
var { db, auth, firebaseApp, FieldValue } = require('../../config/firebase-config');
var { ensureAuthenticated } = require('../../config/auth-config');

var validator = require('../../config/validator-config');
/**
 * @swagger
 * tags:
 *  name: DonHang
 *  description: Đơn hàng
 */


/**
 * @swagger
 * /api/don-hang/quan-ly:
 *  get:
 *      summary: Lấy danh sách tất cả đơn hàng
 *      tags: [DonHang]
 *      responses:
 *          200:
 *              description: Danh sách đơn hàng
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
 *                                          ma_don_hang: 
 *                                              type: string
 *                                          ma_nguoi_dung: 
 *                                              type: string
 *                                          ten_nguoi_dung:
 *                                              type: string
 *                                          ten_nguoi_nhan: 
 *                                              type: string
 *                                          dia_chi: 
 *                                              type: string
 *                                          ngay_mua:
 *                                              type: string
 *                                          tinh_trang_don_hang: 
 *                                              type: string
 *  
 */
router.get('/quan-ly', async (req, res) => {
    try {
        var collectionDonHang = db.collection('DonHang');
        var data = await collectionDonHang.get();
        return res.json({
            success: true, data: data.docs.map((value) => {
                let item = value.data();
                item.ma_don_hang = value.id;
                return item;
            })
        });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});
/**
 * @swagger
 * /api/don-hang:
 *  get:
 *      summary: Lấy danh sách đơn hàng
 *      tags: [DonHang]
 *      responses:
 *          200:
 *              description: Danh sách đơn hàng
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
 *                                          ma_don_hang: 
 *                                              type: string
 *                                          ma_nguoi_dung: 
 *                                              type: string
 *                                          ten_nguoi_dung:
 *                                              type: string
 *                                          ten_nguoi_nhan: 
 *                                              type: string
 *                                          dia_chi: 
 *                                              type: string
 *                                          ngay_mua:
 *                                              type: string
 *                                          tinh_trang_don_hang: 
 *                                              type: string
 *  
 */
router.get('/', async (req, res) => {
    try {
        var collectionDonHang = db.collection('DonHang').where('ma_nguoi_dung', '==', req.user.uid);
        var data = await collectionDonHang.get();
        return res.json({
            success: true, data: data.docs.map((value) => {
                let item = value.data();
                item.ma_don_hang = value.id;
                return item;
            })
        });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});
/**
 * @swagger
 * /api/don-hang/chi-tiet:
 *  get:
 *      summary: Lấy chi tiết đơn hàng
 *      tags: [DonHang]
 *      parameters:
 *       - in: query
 *         name: ma_don_hang
 *         schema:
 *           type: string
 *         description: Mã đơn hàng
 *      responses:
 *          200:
 *              description: Chi tiết đơn hàng
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
 *                                          ma_don_hang: 
 *                                              type: string
 *                                          ma_nguoi_dung: 
 *                                              type: string
 *                                          ten_nguoi_dung:
 *                                              type: string
 *                                          ten_nguoi_nhan: 
 *                                              type: string
 *                                          dia_chi: 
 *                                              type: string
 *                                          ngay_mua:
 *                                              type: string
 *                                          tinh_trang_don_hang: 
 *                                              type: string
 *  
 */
router.get('/chi-tiet', async (req, res) => {
    try {
        var data = await db.collection('DonHang').doc(req.query.ma_don_hang).get();
        let result = data.data();
        result.ma_don_hang = data.id;
        return res.json({ success: true, data: result });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/don-hang/xac-nhan-don-hang:
 *  post:
 *      summary: Xác nhận đơn hàng
 *      tags: [DonHang]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ma_don_hang: 
 *                             type: string
 *                      required:
 *                          ma_don_hang
 *      responses:
 *          200:
 *              description: Trạng thái xác nhận
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Trạng thái trả về
 */
router.post('/xac-nhan-don-hang', async (req, res) => {
    try {
        var donHang = await db.collection('DonHang').doc(req.body.ma_don_hang).get();
        if (donHang.exists) {
            donHang.ref.update({ tinh_trang_don_hang: 'Đang xử lý' });
            return res.json({ success: true });
        }
        else {
            return res.json({ success: false, message: "Đơn hàng không tồn tại" })
        }
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/don-hang/xac-nhan-hoan-thanh:
 *  post:
 *      summary: Xác nhận hoàn thành đơn hàng
 *      tags: [DonHang]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ma_don_hang: 
 *                             type: string
 *                      required:
 *                          ma_don_hang
 *      responses:
 *          200:
 *              description: Trạng thái xác nhận
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Trạng thái trả về
 */
router.post('/xac-nhan-hoan-thanh', async (req, res) => {
    try {
        var donHang = await db.collection('DonHang').doc(req.body.ma_don_hang).get();
        if (donHang.exists) {
            if (donHang.data().tinh_trang_don_hang !== 'Đang xử lý') {
                return res.json({ success: false, message: "Trạng thái đơn hàng phải là đang xử lý" });
            }
            donHang.ref.update({ tinh_trang_don_hang: 'Đã hoàn thành' });
            return res.json({ success: true });
        }
        else {
            return res.json({ success: false, message: "Đơn hàng không tồn tại" });
        }
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

module.exports = router;