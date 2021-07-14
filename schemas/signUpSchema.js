const signUpSchema = {
    type: "object",
    properties: {
        ten_nguoi_dung: { type: "string", minLength: 1, maxLength: 100 },
        ten_tai_khoan: { type: "string", minLength: 1, maxLength: 25 },
        mat_khau: { type: "string", format: "password", minLength: 8 },
        dia_chi: { type: "string", minLength: 1, maxLength: 200 },
        so_dien_thoai: { type: "string", minLength: 8, maxLength: 11 },
        email: { type: "string", format: "email" }
    },
    required: ["ten_nguoi_dung", "ten_tai_khoan", "mat_khau", "email"],
    additionalProperties: false,
}
module.exports = signUpSchema;