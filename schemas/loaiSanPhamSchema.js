const loaiSanPhamSchema = {
    type: "object",
    properties: {
        loai_san_pham: { type: "string", minLength: 1, maxLength: 200 },
        ma_loai_san_pham_cha: { type: "string", minLength: 1, maxLength: 200 }
    },
    required: ["loai_san_pham"],
    additionalProperties: false
}
module.exports = loaiSanPhamSchema;