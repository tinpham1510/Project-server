const loginSchema = {
    type: "object",
    properties: {
        ten_tai_khoan: { type: "string", minLength: 1 },
        mat_khau: { type: "string", minLength: 1 }
    },
   required: ["ten_tai_khoan", "mat_khau"],
    additionalProperties: false,
}
module.exports = loginSchema;