var express = require('express');
var router = express.Router();
var { db, auth, firebaseApp } = require('../../config/firebase-config');
var { ensureAuthenticated } = require('../../config/auth-config');

var validator = require('../../config/validator-config');
var signUpSchema = require('../../schemas/signUpSchema');
/**
 * @swagger
 * tags:
 *  name: NguoiDung
 *  description: Người dùng
 */

/**
 * @swagger
 * /api/nguoi-dung/quan-ly:
 *  get:
 *      summary: Lấy danh sách tài khoản
 *      tags: [NguoiDung]
 *      responses:
 *          200:
 *              description: Danh sách tài khoản
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
 *                                          ma_nguoi_dung: 
 *                                              type: string
 *                                          ten_nguoi_dung: 
 *                                              type: string
 *                                          ten_tai_khoan: 
 *                                              type: string
 *                                          email: 
 *                                              type: string
 *                                          dia_chi:
 *                                              type: string
 *                                          so_dien_thoai:
 *                                              type: string
 * 
 */
router.get('/quan-ly', ensureAuthenticated, async (req, res) => {
    let data = await db.collection('NguoiDung').get();
    let result = data.docs.map((item) => {
        return {
            ma_nguoi_dung: item.id,
            ten_nguoi_dung: item.data().ten_nguoi_dung,
            ten_tai_khoan: item.data().ten_tai_khoan,
            email: item.data().email,
            dia_chi: item.data().dia_chi,
            so_dien_thoai: item.data().so_dien_thoai,
            loai_nguoi_dung: item.data().loai_nguoi_dung,
        };
    });
    return res.json({ success: true, data: result });
});

/**
 * @swagger
 * /api/nguoi-dung/quan-ly:
 *  delete:
 *      summary: Xoá tài khoản
 *      tags: [NguoiDung]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ma_nguoi_dung:
 *                             type: string
 *                      required:
 *                          ma_nguoi_dung
 *      responses:
 *          200:
 *              description: Trạng thái trả về
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  description: Trạng thái trả về
 * 
 */
router.delete('/quan-ly', ensureAuthenticated, async (req, res) => {
    try {
        await auth.deleteUser(req.body.ma_nguoi_dung);
        await db.collection('NguoiDung').doc(req.body.ma_nguoi_dung).delete();
        return res.json({ success: true });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/nguoi-dung/thong-tin:
 *  get:
 *      summary: Lấy thông tin tài khoản
 *      tags: [NguoiDung]
 *      responses:
 *          200:
 *              description: Thông tin tài khoản
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  description: Trạng thái trả về
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      ten_nguoi_dung: 
 *                                          type: string
 *                                      ten_tai_khoan: 
 *                                          type: string
 *                                      email: 
 *                                          type: string
 *                                      dia_chi:
 *                                          type: string
 *                                      so_dien_thoai:
 *                                          type: string
 * 
 */
router.get('/thong-tin', ensureAuthenticated, async (req, res) => {
    db.collection('NguoiDung').doc(req.user.uid).get().then((doc) => {
        return res.json({ success: true, data: doc.data() });
    });
});

/**
 * @swagger
 * /api/nguoi-dung:
 *  post:
 *      summary: Đăng ký tài khoản
 *      tags: [NguoiDung]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ten_nguoi_dung: 
 *                             type: string
 *                         ten_tai_khoan: 
 *                             type: string
 *                         mat_khau:
 *                             type: string
 *                         email: 
 *                             type: string
 *                         dia_chi:
 *                             type: string
 *                         so_dien_thoai:
 *                             type: string
 *                      required:
 *                          ten_nguoi_dung
 *                          ten_tai_khoan
 *                          mat_khau
 *                          email
 *      responses:
 *          200:
 *              description: Thông tin người dùng vừa tạo
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  description: Trạng thái trả về
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      ten_nguoi_dung: 
 *                                          type: string
 *                                      ten_tai_khoan: 
 *                                          type: string
 *                                      email: 
 *                                          type: string
 *                                      dia_chi:
 *                                          type: string
 *                                      so_dien_thoai:
 *                                          type: string
 * 
 */
router.post('/', validator(signUpSchema), async function (req, res) {
    existUsers = await db.collection('NguoiDung').where("ten_tai_khoan", "==", req.body.ten_tai_khoan).get();
    if (!existUsers.empty) {
        return res.json({ success: false, message: "The password is invalid or the user does not have a password." });
    }
    firebaseApp.auth().createUserWithEmailAndPassword(req.body.email, req.body.mat_khau)
        .then((userCredential) => {
            let userInfo = {
                ten_nguoi_dung: req.body.ten_nguoi_dung,
                ten_tai_khoan: req.body.ten_tai_khoan,
                mat_khau: req.body.mat_khau,
                email: req.body.email,
                dia_chi: req.body.dia_chi || '',
                so_dien_thoai: req.body.so_dien_thoai || '',
                loai_nguoi_dung: 'KhachHang'
            };
            auth.setCustomUserClaims(userCredential.user.uid, { role: 'KhachHang' });
            db.collection('NguoiDung').doc(userCredential.user.uid)
                .create(userInfo)
                .then(() => {
                    return res.json({ success: true, data: userInfo });
                })
        })
        .catch((err) => {
            return res.json({ success: false, message: err.message });
        })
});

/**
 * @swagger
 * /api/nguoi-dung:
 *  put:
 *      summary: Cập nhật thông tin tài khoản
 *      tags: [NguoiDung]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ten_nguoi_dung: 
 *                             type: string
 *                         ten_tai_khoan: 
 *                             type: string
 *                         dia_chi:
 *                             type: string
 *                         so_dien_thoai:
 *                             type: string
 *      responses:
 *          200:
 *              description: Trạng thái trả về
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  description: Trạng thái trả về
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      ten_nguoi_dung: 
 *                                          type: string
 *                                      ten_tai_khoan: 
 *                                          type: string
 *                                      email: 
 *                                          type: string
 *                                      dia_chi:
 *                                          type: string
 *                                      so_dien_thoai:
 *                                          type: string
 */
router.put('/', ensureAuthenticated, async (req, res) => {
    try {
        var updateNguoiDung = {
            ten_nguoi_dung: req.body.ten_nguoi_dung,
            ten_tai_khoan: req.body.ten_tai_khoan,
            dia_chi: req.body.dia_chi,
            so_dien_thoai: req.body.so_dien_thoai
        };

        await db.collection('NguoiDung').doc(req.user.uid).update(updateNguoiDung);
        return res.json({ success: true, data: updateNguoiDung });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/nguoi-dung/doi-mat-khau:
 *  put:
 *      summary: Đổi mật khẩu
 *      tags: [NguoiDung]
 *      responses:
 *          200:
 *              description: Trạng thái trả về
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  description: Trạng thái trả về
 * 
 */
router.put('/doi-mat-khau', ensureAuthenticated, async (req, res) => {
    try {
        firebaseApp.auth().sendPasswordResetEmail(req.user.email);
        return res.json({ success: true });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
});
module.exports = router;