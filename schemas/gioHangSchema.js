const gioHangSchema = {
    type: "object",
    properties: {
        ma_san_pham: { type: "string", minLength: 1, maxLength: 200 },
        so_luong: { type: "integer" }
    },
    required: ["ma_san_pham", "so_luong"],
    additionalProperties: false
}
module.exports = gioHangSchema;