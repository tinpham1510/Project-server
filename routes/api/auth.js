var express = require('express');
var router = express.Router();
var { db, auth, firebaseApp } = require('../../config/firebase-config');
var validator = require('../../config/validator-config');
var loginSchema = require('../../schemas/loginSchema');

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      summary: Đăng nhập
 *      tags: [NguoiDung]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                         ten_tai_khoan: 
 *                             type: string
 *                         mat_khau:
 *                             type: string
 *                      required:
 *                          ten_tai_khoan
 *                          mat_khau
 *      responses:
 *          200:
 *              description: OK
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
 *                                      access_token:
 *                                          type: string
 *                                          description: Access_token của user
 * 
 */
router.post('/login', validator(loginSchema), function (req, res) {

    let username = req.body.ten_tai_khoan;
    let password = req.body.mat_khau;

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // let email = db.collection('NguoiDung').where
    db.collection('NguoiDung').where('ten_tai_khoan', '==', username).select('email').get().then((querySnapshot) => {
        if (querySnapshot.empty)
            return res.json({ success: false, message: 'Wrong username or password' });
        else {
            let email = querySnapshot.docs[0].get('email');
            const expiresIn = 60 * 60 * 24 * 5 * 1000;
            firebaseApp.auth().signInWithEmailAndPassword(email, password)
                .then(({ user }) => {
                    user.getIdToken().then((idToken) => {
                        auth.createSessionCookie(idToken, { expiresIn })
                            .then((sessionCookie) => {
                                const options = { maxAge: expiresIn, httpOnly: true };
                                res.cookie("session", sessionCookie, options);
                                res.json({ success: true, access_token: sessionCookie });
                            }, (error) => {
                                res.status(401).json({ success: false, message: error?.message });
                            })
                    });
                }).catch(error => res.json({ success: false, message: error.message }));
        }
    });
});

/**
 * @swagger
 * /api/auth/logout:
 *  post:
 *      summary: Đăng xuất
 *      tags: [NguoiDung]
 *      responses:
 *          200:
 *              description: OK
 */
router.post('/logout', function (req, res) {
    res.clearCookie('session');
    firebaseApp.auth().signOut();
    res.send('OK');
});

module.exports = router;