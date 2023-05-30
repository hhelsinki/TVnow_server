function getHeaders(req, res) {
    console.log(req.headers.api_key);
}

module.exports = {getHeaders};