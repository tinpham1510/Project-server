const Ajv = require("ajv");
const ajv = new Ajv({ coerceTypes: true });
const addFormats = require("ajv-formats");

addFormats(ajv);

module.exports = function (schema) {
    return function (req, res, next) {
        const validate = ajv.compile(schema);
        const valid = validate(req.body);
        if (valid)
            next();
        else
            res.status(500).send({ success: false, message: validate.errors?.message ?? validate.errors });
    }
}