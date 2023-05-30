const crypto = require('crypto');
const randtoken = require('rand-token');
const timekey = require('rand-token').generator({
    chars:'0-9'
});

const password = crypto.randomBytes(10).toString('base64url');
const twofactor_id = timekey.generate(6);
const access_token = randtoken.generate(20);

module.exports = {password, twofactor_id, access_token};

