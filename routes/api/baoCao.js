var express = require('express');
var router = express.Router();
var { db, auth, firebaseApp, FieldValue } = require('../../config/firebase-config');
var { ensureAuthenticated } = require('../../config/auth-config');

var validator = require('../../config/validator-config');

/**
 * @swagger
 * tags:
 *  name: BaoCao
 *  description: Báo cáo
 */


/**
 * @swagger
 * /api/bao-cao/bao-cao-doanh-thu:
 *  get:
 *      summary: Lấy dữ liệu cho báo cáo
 *      tags: [BaoCao]
 *      parameters:
 *       - in: query
 *         name: tu_ngay
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: den_ngay
 *         schema:
 *           type: string
 *           format: date
 *      responses:
 *          200:
 *              description: Danh sách các sản phẩm
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Trạng thái trả về
 *                                  data:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              ten_san_pham:
 *                                                  type: string
 *                                              loai_san_pham:
 *                                                  type: string
 *                                              so_luong_da_ban:
 *                                                  type: integer
 *                                              gia_ban_hien_tai:
 *                                                  type: integer 
 *                                              doanh_thu:
 *                                                  type: integer 
 */
router.get('/bao-cao-doanh-thu', async (req, res) => {
    try {
        var ngay_bat_dau = new Date(req.query.tu_ngay);
        var ngay_ket_thuc = new Date(req.query.den_ngay);
        if (ngay_bat_dau > ngay_ket_thuc) {
            return res.json({ success: false, message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc" });
        }
        var collectionSanPham = db.collection('SanPham');
        var collectionDonHang = db.collection('DonHang').where('ngay_mua', '>=', ngay_bat_dau).where('ngay_mua', '<=', ngay_ket_thuc);

        var sanPham = await collectionSanPham.get();
        var data = await collectionDonHang.get();


        let result = new Map();

        for (var item of sanPham.docs) {
            var itemData = item.data();
            result.set(item.id, {
                ten_san_pham: itemData.ten_san_pham,
                loai_san_pham: itemData.loai_san_pham || "Chưa phân loại",
                so_luong_da_ban: 0,
                gia_ban_hien_tai: itemData.gia_tien,
                doanh_thu: 0
            });
        }

        for (var item of data.docs) {
            var itemData = item.data();
            for (var sanPhamDonHang of itemData.san_pham) {
                if (result.get(sanPhamDonHang.ma_san_pham) != null) {
                    result.get(sanPhamDonHang.ma_san_pham).so_luong_da_ban += sanPhamDonHang.so_luong;
                    result.get(sanPhamDonHang.ma_san_pham).doanh_thu += sanPhamDonHang.gia_tien * sanPhamDonHang.so_luong;
                }
            }
        }

        return res.json({
            success: true, data: Array.from(result.values())
        });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

module.exports = router;