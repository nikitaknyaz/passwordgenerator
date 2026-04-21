const { checkStrength } = require('../main_funcs/generatePass.js');

function check(req, res) {
    const { password } = req.body;
    const result = checkStrength(password);
    res.json(result);
}

module.exports = { check };