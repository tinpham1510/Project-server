var admin = require('firebase-admin');
var serviceAccount = require('../private_key/cnpmcs-4614c-firebase-adminsdk-s3uxo-c8d85e88aa.json');
var firebase_app = require("firebase/app");

const FieldValue = admin.firestore.FieldValue;

require('firebase/storage');
require("firebase/auth");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
admin.firestore().settings({ ignoreUndefinedProperties: true });
var firebaseConfig = {
    apiKey: "AIzaSyAvgxGSbfh5DP0Cb3sV_hSN8dN8tFej8vM",
    authDomain: "cnpmcs-4614c.firebaseapp.com",
    projectId: "cnpmcs-4614c",
    storageBucket: "cnpmcs-4614c.appspot.com",
    messagingSenderId: "517958402098",
    appId: "1:517958402098:web:190cf0d98c9711a0d9fc2b",
    measurementId: "G-P911PGBEH8"
};
// Initialize Firebase
firebase_app.initializeApp(firebaseConfig);
module.exports = { db: admin.firestore(), auth: admin.auth(), firebaseApp: firebase_app.default, FieldValue };