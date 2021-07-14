var express = require('express');
var router = express.Router();
var { db, auth, firebaseApp, FieldValue } = require('../../config/firebase-config');
var { ensureAuthenticated } = require('../../config/auth-config');

var validator = require('../../config/validator-config');
const loaiSanPhamSchema = require('../../schemas/loaiSanPhamSchema');
const loaiSanPhamUpdateSchema = require('../../schemas/loaiSanPhamUpdateSchema');
/**
 * @swagger
 * tags:
 *  name: LoaiSanPham
 *  description: Loại sản phẩm
 */

/**
 * @swagger
 * /api/loai-san-pham:
 *  get:
 *      summary: Lấy danh sách loại sản phẩm
 *      tags: [LoaiSanPham]
 *      parameters:
 *       - in: query
 *         name: ma_loai_san_pham_cha
 *         schema:
 *           type: string
 *         description: Mã loại sản phẩm cha
 *      responses:
 *          200:
 *              description: Danh sách loại sản phẩm
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
 *                                              loai_san_pham:
 *                                                  type: string
 *                                              ma_loai_san_pham_cha:
 *                                                  type: string
 *  
 */
router.get('/', async (req, res) => {
    var collectionLoaiSanPham = db.collection('LoaiSanPham');
    if (req.query.ma_loai_san_pham_cha != null)
        collectionLoaiSanPham = collectionLoaiSanPham.where('ma_loai_san_pham_cha', '==', req.query.ma_loai_san_pham_cha);
    collectionLoaiSanPham.get().then((querySnap) => {
        let data = [];
        querySnap.forEach((doc) => {
            let item = {};
            item.loai_san_pham = doc.data().loai_san_pham;
            item.ma_loai_san_pham = doc.id;
            data.push(item);
        });
        return res.json({ success: true, data: data });
    }).catch((err) => {
        return res.json({ success: false, message: err.message });
    });
});

/**
 * @swagger
 * /api/loai-san-pham:
 *  post:
 *      summary: Thêm loại sản phẩm
 *      tags: [LoaiSanPham]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         loai_san_pham: 
 *                             type: string
 *                         ma_loai_san_pham_cha: 
 *                             type: string
 *                      required:
 *                          loai_san_pham
 *      responses:
 *          200:
 *              description: Thông tin loại sản phẩm đã thêm
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
 *                                          loai_san_pham: 
 *                                              type: string
 *                                          loai_san_pham_cha: 
 *                                              type: string
 */
router.post('/', validator(loaiSanPhamSchema), async (req, res) => {
    try {
        var collectionLoaiSanPham = db.collection('LoaiSanPham');
        if (req.body.ma_loai_san_pham_cha != null) {
            if (!(await collectionLoaiSanPham.doc(req.body.ma_loai_san_pham_cha).get()).exists) {
                throw new Error("Không tồn tại loại sản phẩm cha");
            }
            if (!((await collectionLoaiSanPham.where('loai_san_pham', '==', req.body.loai_san_pham)
                .where('ma_loai_san_pham_cha', '==', req.body.ma_loai_san_pham_cha).get()).empty))
                throw new Error("Loại sản phẩm này đã tồn tại");
        }
        else {
            if (!((await collectionLoaiSanPham.where('loai_san_pham', '==', req.body.loai_san_pham).get()).empty))
                throw new Error("Loại sản phẩm này đã tồn tại");
        }

        var insertLoaiSanPham = {
            loai_san_pham: req.body.loai_san_pham,
            ma_loai_san_pham_cha: req.body.ma_loai_san_pham_cha ?? "root",
        }
        var result = await collectionLoaiSanPham.add(insertLoaiSanPham);
        insertLoaiSanPham.ma_loai_san_pham = result.id;
        return res.json({ success: true, data: insertLoaiSanPham });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/loai-san-pham:
 *  put:
 *      summary: Sửa loại sản phẩm
 *      tags: [LoaiSanPham]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ma_loai_san_pham:
 *                             type: string
 *                         loai_san_pham: 
 *                             type: string
 *                         ma_loai_san_pham_cha: 
 *                             type: string
 *                      required:
 *                          ma_loai_san_pham,
 *                          loai_san_pham
 *      responses:
 *          200:
 *              description: Thông tin loại sản phẩm đã sửa
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
 *                                          ma_loai_san_pham:
 *                                              type: string
 *                                          loai_san_pham: 
 *                                              type: string
 *                                          ma_loai_san_pham_cha: 
 *                                              type: string
 */
router.put('/', validator(loaiSanPhamUpdateSchema), async (req, res) => {
    try {
        var collectionLoaiSanPham = db.collection('LoaiSanPham');
        if (req.body.ma_loai_san_pham_cha != null) {
            if (!(await collectionLoaiSanPham.doc(req.body.ma_loai_san_pham_cha).get()).exists) {
                throw new Error("Không tồn tại loại sản phẩm cha");
            }
            if (!((await collectionLoaiSanPham.where('loai_san_pham', '==', req.body.loai_san_pham)
                .where('ma_loai_san_pham_cha', '==', req.body.ma_loai_san_pham_cha).get()).empty))
                throw new Error("Loại sản phẩm này đã tồn tại");
        }
        else {
            if (!((await collectionLoaiSanPham.where('loai_san_pham', '==', req.body.loai_san_pham).get()).empty))
                throw new Error("Loại sản phẩm này đã tồn tại");
        }
        var updateLoaiSanPham = {
            loai_san_pham: req.body.loai_san_pham,
            loai_san_pham_cha: req.body.loai_san_pham_cha,
        }

        //Batch update
        var batch = db.batch();
        var loaiSanPhamRef = collectionLoaiSanPham.doc(req.body.ma_loai_san_pham);
        batch.update(loaiSanPhamRef, updateLoaiSanPham);
        var collectionSanPham = await db.collection('SanPham')
            .where('ma_loai_san_pham', '==', req.body.ma_loai_san_pham).get();
        for (var sanPham of collectionSanPham.docs) {
            batch.update(sanPham, { loai_san_pham: req.body.loai_san_pham });
        }

        var result = await batch.commit();
        updateLoaiSanPham.ma_loai_san_pham = req.body.ma_loai_san_pham;
        return res.json({ success: true, data: updateLoaiSanPham });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});


/**
 * @swagger
 * /api/loai-san-pham:
 *  delete:
 *      summary: Xoá loại sản phẩm
 *      tags: [LoaiSanPham]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          ma_loai_san_pham:
 *                              type: string
 *                      required:
 *                          ma_loai_san_pham
 *      responses:
 *          200:
 *              description: Mã loại sản phẩm đã xoá
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
 *                                          ma_loai_san_pham: 
 *                                              type: string
 */
router.delete('/', async (req, res) => {
    try {
        var batch = db.batch();
        var collectionLoaiSanPhamRef = db.collection('LoaiSanPham').doc(req.body.ma_loai_san_pham);
        batch.delete(collectionLoaiSanPhamRef);
        var collectionSanPham = await db.collection('SanPham')
            .where('ma_loai_san_pham', '==', req.body.ma_loai_san_pham).get();
        for (var sanPham of collectionSanPham.docs) {
            batch.update(sanPham, { ma_loai_san_pham: FieldValue.delete(), loai_san_pham: FieldValue.delete() });
        }
        var result = await batch.commit();
        return res.json({ success: true, data: { ma_san_pham: req.body.ma_loai_san_pham } });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

module.exports = router;