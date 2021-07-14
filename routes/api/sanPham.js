var express = require('express');
var router = express.Router();
var { db, auth, firebaseApp, FieldValue } = require('../../config/firebase-config');
var { ensureAuthenticated } = require('../../config/auth-config');

var validator = require('../../config/validator-config');
const sanPhamSchema = require('../../schemas/sanPhamSchema');
const sanPhamUpdateSchema = require('../../schemas/sanPhamUpdateSchema');
/**
 * @swagger
 * tags:
 *  name: SanPham
 *  description: Sản phẩm
 */

/**
 * @swagger
 * /api/san-pham:
 *  get:
 *      summary: Lấy danh sách sản phẩm
 *      tags: [SanPham]
 *      parameters:
 *       - in: query
 *         name: ma_loai_san_pham
 *         schema:
 *           type: string
 *         description: Lọc theo mã loại sản phẩm
 *       - in: query
 *         name: gia_tien_min
 *         schema:
 *           type: integer
 *         description: Lọc theo giá tiền tối thiểu
 *       - in: query
 *         name: gia_tien_max
 *         schema:
 *           type: integer
 *         description: Lọc theo giá tiền tối đa
 *       - in: query
 *         name: ten_thuong_hieu
 *         schema:
 *           type: string
 *         description: Lọc theo tên thương hiệu
 *       - in: query
 *         name: xuat_xu
 *         schema:
 *           type: string
 *         description: Lọc theo xuất xứ
 *       - in: query
 *         name: tinh_trang_san_pham
 *         schema:
 *           type: string
 *         description: Lọc theo tình trạng sản phẩm
 *       - in: query
 *         name: thoi_gian_su_dung
 *         schema:
 *           type: integer
 *         description: Lọc theo thời gian sử dụng (tháng)
 *      responses:
 *          200:
 *              description: Danh sách sản phẩm
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
 *                                          gia_tien: 
 *                                              type: number
 *                                          tinh_trang_san_pham:
 *                                              type: string
 *                                          thoi_gian_su_dung:
 *                                              type: number
 *  
 */
router.get('/', async (req, res) => {
    var collectionSanPham = db.collection('SanPham');
    if (req.query.ma_loai_san_pham)
        collectionSanPham = collectionSanPham.where('ma_loai_san_pham', '==', req.query.ma_loai_san_pham);
    if (req.query.gia_tien_min)
        collectionSanPham = collectionSanPham.where('gia_tien', '>=', req.query.gia_tien_min);
    if (req.query.gia_tien_max)
        collectionSanPham = collectionSanPham.where('gia_tien', '>=', req.query.gia_tien_max);
    if (req.query.ten_thuong_hieu)
        collectionSanPham = collectionSanPham.where('ten_thuong_hieu', '==', req.query.ten_thuong_hieu);
    if (req.query.xuat_xu)
        collectionSanPham = collectionSanPham.where('xuat_xu', '==', req.query.xuat_xu);
    if (req.query.tinh_trang_san_pham)
        collectionSanPham = collectionSanPham.where('tinh_trang_san_pham', '==', req.query.tinh_trang_san_pham);
    if (req.query.thoi_gian_su_dung)
        collectionSanPham = collectionSanPham.where('thoi_gian_su_dung', '<=', req.query.thoi_gian_su_dung);
    collectionSanPham.get().then((querySnap) => {
        let data = [];
        querySnap.forEach((doc) => {
            let item = doc.data();
            item.ma_san_pham = doc.id;
            data.push(item);
        });
        return res.json({ success: true, data: data });
    }).catch((err) => {
        return res.json({ success: false, message: err.message });
    });
});
/**
 * @swagger
 * /api/san-pham/{id}:
 *  get:
 *      summary: Lấy chi tiết sản phẩm
 *      tags: [SanPham]
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *         description: Mã sản phẩm
 *      responses:
 *          200:
 *              description: Thông tin sản phẩm
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
 *                                      type: object
 *                                      properties:
 *                                          ma_san_pham: 
 *                                              type: string
 *                                          ten_san_pham: 
 *                                              type: string
 *                                          gia_tien: 
 *                                              type: number
 *                                          so_luong_ton_kho:
 *                                              type: number
 *                                          loai_san_pham:
 *                                              type: number
 *                                          mo_ta: 
 *                                              type: string
 *                                          cau_hinh: 
 *                                              type: string
 *                                          xuat_xu: 
 *                                              type: number
 *                                          ten_thuong_hieu:
 *                                              type: string
 *                                          tinh_trang_san_pham:
 *                                              type: string
 *                                          thoi_gian_su_dung:
 *                                              type: number
 *                                          file:
 *                                              type: array
 *                                              item:
 *                                                  type: string
 *  
 */
router.get('/:id', async (req, res) => {
    try {
        var collectionSanPham = db.collection('SanPham');
        var result = await collectionSanPham.doc(req.params.id).get();
        if (!result.exists)
            throw new Error('Không tồn tại sản phẩm.');
        return res.json({ success: true, data: result.data() });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});
/**
 * @swagger
 * /api/san-pham:
 *  post:
 *      summary: Thêm sản phẩm
 *      tags: [SanPham]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ten_san_pham: 
 *                             type: string
 *                         ma_loai_san_pham:
 *                             type: string
 *                         gia_tien: 
 *                             type: integer
 *                         so_luong:
 *                             type: integer
 *                         mo_ta: 
 *                             type: string
 *                         cau_hinh:
 *                             type: string
 *                         ten_thuong_hieu:
 *                             type: string
 *                         xuat_xu: 
 *                             type: string
 *                         tinh_trang_san_pham:
 *                             type: string
 *                         thoi_gian_su_dung:
 *                             type: integer
 *                         file:
 *                             type: array
 *                             items:
 *                                 type: string
 *                                 format: binary
 *                      required:
 *                          ten_san_pham
 *                          gia_tien
 *                          so_luong
 *                          ten_thuong_hieu
 *                          tinh_trang_san_pham
 *                          thoi_gian_su_dung    
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
 *                                          ten_san_pham: 
 *                                              type: string
 *                                          gia_tien: 
 *                                              type: number
 *                                          so_luong_ton_kho:
 *                                              type: number
 *                                          loai_san_pham:
 *                                              type: number
 *                                          mo_ta: 
 *                                              type: string
 *                                          cau_hinh: 
 *                                              type: string
 *                                          xuat_xu: 
 *                                              type: number
 *                                          ten_thuong_hieu:
 *                                              type: string
 *                                          tinh_trang_san_pham:
 *                                              type: string
 *                                          thoi_gian_su_dung:
 *                                              type: number
 */
router.post('/', validator(sanPhamSchema), async (req, res) => {
    try {
        var fileURL_arr = [];

        var collectionSanPham = db.collection('SanPham');
        var insertSanPham = {
            ten_san_pham: req.body.ten_san_pham,
            ma_loai_san_pham: req.body.ma_loai_san_pham,
            loai_san_pham: (await db.collection('LoaiSanPham')
                .doc(req.body.ma_loai_san_pham).get()).data().loai_san_pham,
            gia_tien: req.body.gia_tien,
            so_luong: req.body.so_luong,
            mo_ta: req.body.mo_ta || "",
            cau_hinh: req.body.cau_hinh || "",
            ten_thuong_hieu: req.body.ten_thuong_hieu,
            xuat_xu: req.body.xuat_xu || "",
            tinh_trang_san_pham: req.body.tinh_trang_san_pham,
            thoi_gian_su_dung: req.body.thoi_gian_su_dung
        }
        var result = await collectionSanPham.add(insertSanPham);
        insertSanPham.ma_san_pham = result.id;
        if (req.files?.file) {
            if (Array.isArray(req.files?.file)) {
                for (const file of req.files?.file) {
                    var snapshot = await firebaseApp.storage()
                        .ref(`SanPham/${result.id}/${file.name}`)
                        .put(file.data, { contentType: file.mimetype });
                    var fileURL = await snapshot.ref.getDownloadURL();
                    fileURL_arr.push(fileURL);
                }
            }
            else {
                var file = req.files?.file;
                var snapshot = await firebaseApp.storage()
                    .ref(`SanPham/${result.id}/${file.name}`)
                    .put(file.data, { contentType: file.mimetype });
                var fileURL = await snapshot.ref.getDownloadURL();
                fileURL_arr.push(fileURL);
            }
        }
        console.log(await fileURL_arr);
        insertSanPham.file = fileURL_arr;
        var result = await result.update({ file: await fileURL_arr });
        return res.json({ success: true, data: insertSanPham });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/san-pham:
 *  put:
 *      summary: Sửa thông tin sản phẩm
 *      tags: [SanPham]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ma_san_pham:
 *                             type: string
 *                         ma_loai_san_pham:
 *                             type: string
 *                         ten_san_pham: 
 *                             type: string
 *                         gia_tien: 
 *                             type: integer
 *                         so_luong:
 *                             type: integer
 *                         mo_ta: 
 *                             type: string
 *                         cau_hinh:
 *                             type: string
 *                         ten_thuong_hieu:
 *                             type: string
 *                         xuat_xu: 
 *                             type: string
 *                         tinh_trang_san_pham:
 *                             type: string
 *                         thoi_gian_su_dung:
 *                             type: integer
 *                         file:
 *                             type: array
 *                             items:
 *                                 type: string
 *                                 format: binary
 *                         delete_file:
 *                             type: array
 *                             items:
 *                                  type: string
 *                      required:
 *                          ma_san_pham
 *      responses:
 *          200:
 *              description: Thông tin sản phẩm đã sửa
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
 *                                          ten_san_pham: 
 *                                              type: string
 *                                          gia_tien: 
 *                                              type: number
 *                                          so_luong_ton_kho:
 *                                              type: number
 *                                          loai_san_pham:
 *                                              type: string
 *                                          mo_ta: 
 *                                              type: string
 *                                          cau_hinh: 
 *                                              type: string
 *                                          xuat_xu: 
 *                                              type: number
 *                                          ten_thuong_hieu:
 *                                              type: string
 *                                          tinh_trang_san_pham:
 *                                              type: string
 *                                          thoi_gian_su_dung:
 *                                              type: number
 */
router.put('/', validator(sanPhamUpdateSchema), async (req, res) => {
    try {
        var collectionSanPham = db.collection('SanPham');
        var loai_san_pham = (await db.collection('LoaiSanPham').
            doc(req.body.ma_loai_san_pham || '-').get())?.data()?.loai_san_pham;
        var updateSanPham = {
            ten_san_pham: req.body.ten_san_pham,
            ma_loai_san_pham: req.body.ma_loai_san_pham,
            loai_san_pham: loai_san_pham,
            gia_tien: req.body.gia_tien,
            so_luong: req.body.so_luong,
            mo_ta: req.body.mo_ta,
            cau_hinh: req.body.cau_hinh,
            ten_thuong_hieu: req.body.ten_thuong_hieu,
            xuat_xu: req.body.xuat_xu,
            tinh_trang_san_pham: req.body.tinh_trang_san_pham,
            thoi_gian_su_dung: req.body.thoi_gian_su_dung
        }
        var result = await collectionSanPham.doc(req.body.ma_san_pham).update(updateSanPham);
        updateSanPham.ma_san_pham = req.body.ma_san_pham;
        var fileURL_arr = [];
        if (req.body.delete_file != null)
            for (var deleteURL of req.body.delete_file.split(',')) {
                firebaseApp.storage().refFromURL(deleteURL).delete();
                await collectionSanPham.doc(req.body.ma_san_pham).update({ file: FieldValue.arrayRemove(deleteURL) });
            }
        if (req.files?.file) {
            if (Array.isArray(req.files?.file)) {
                for (const file of req.files?.file) {
                    var snapshot = await firebaseApp.storage()
                        .ref(`SanPham/${updateSanPham.ma_san_pham}/${file.name}`)
                        .put(file.data, { contentType: file.mimetype });
                    var fileURL = await snapshot.ref.getDownloadURL();
                    await collectionSanPham.doc(req.body.ma_san_pham).update({ file: FieldValue.arrayUnion(fileURL) });
                    console.log(fileURL);
                    fileURL_arr.push(fileURL);
                }
            }
            else {
                var file = req.files?.file;
                var snapshot = await firebaseApp.storage()
                    .ref(`SanPham/${updateSanPham.ma_san_pham}/${file.name}`)
                    .put(file.data, { contentType: file.mimetype });
                var fileURL = await snapshot.ref.getDownloadURL();
                await collectionSanPham.doc(req.body.ma_san_pham).update({ file: FieldValue.arrayUnion(fileURL) });
                console.log(fileURL);
                fileURL_arr.push(fileURL);
            }

        }

        updateSanPham.delete_file = req.body.delete_file?.split(',');
        updateSanPham.new_file = fileURL_arr;
        return res.json({ success: true, data: updateSanPham });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});


/**
 * @swagger
 * /api/san-pham:
 *  delete:
 *      summary: Xoá sản phẩm
 *      tags: [SanPham]
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
        var collectionSanPham = db.collection('SanPham');
        await collectionSanPham.doc(req.body.ma_san_pham).delete();
        firebaseApp.storage().ref(`SanPham/${req.body.ma_san_pham}`).delete().then(() => { }, () => { });
        return res.json({ success: true, data: { ma_san_pham: req.body.ma_san_pham } });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

module.exports = router;