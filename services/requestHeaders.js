function getHeaders(req, res) {
    console.log(req.headers['api-key']);
}

module.exports = {getHeaders};