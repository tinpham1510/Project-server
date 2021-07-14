const sanPhamUpdateSchema = {
    type: "object",
    properties: {
        ma_san_pham: { type: "string" },
        ten_san_pham: { type: "string", minLength: 1, maxLength: 200 },
        gia_tien: { type: "integer", minimum: 1, maximum: 99999999999 },
        so_luong: { type: "integer", minimum: 1, maximum: 999999 },
        mo_ta: { type: "string", minLength: 0, maxLength: 1000 },
        cau_hinh: { type: "string", minLength: 0, maxLength: 1000 },
        ten_thuong_hieu: { type: "string", minLength: 1, maxLength: 200 },
        xuat_xu: { type: "string", minLength: 0, maxLength: 200 },
        tinh_trang_san_pham: { type: "string", minLength: 1, maxLength: 200 },
        thoi_gian_su_dung: { type: "integer", minimum: 0, maximum: 999 },
    },
    required: ["ma_san_pham"],
    additionalProperties: true
}
module.exports = sanPhamUpdateSchema;