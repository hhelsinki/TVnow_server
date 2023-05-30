const pool = require('./database.js');
const baseApiKey = require('../api-key.js')

function checkEmail(req, res) {
    const api_key = req.headers.api_key;
    var email = req.body.email;

    if (api_key === baseApiKey) {
        if (!email) {res.sendStatus(401); return;}

        pool.query(`SELECT * FROM user WHERE email = ?`, [email], (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    console.log('email available');
                    res.send({ status: true, msg: 'email can be use.' })
                    break;
                default:
                    console.log('email unavailable');
                    res.send({ status: false, msg: 'email is already used.' });
                    break;
            }
        });
        return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }


}
function checkUsername(req, res) {
    let api_key = req.headers.api_key;
    const username = req.body.username;

    if (api_key === baseApiKey) {
        if (!username) {res.sendStatus(401); return;}

        pool.query(`SELECT * FROM user WHERE username = ?`, [username], (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    console.log('username ok');
                    res.send({ status: true, msg: 'username can be use.' });
                    break;
                default:
                    console.log('username not ok');
                    res.send({ status: false, msg: 'username is already used.' })
                    break;
            }
        });
        return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }


}

function checkGiftcard(req, res) {
    let api_key = req.headers.api_key;
    const giftcard_code = req.body.giftcard_code;

    if (api_key === baseApiKey) {
        if (!giftcard_code) {res.sendStatus(401); return;}

        pool.query(`SELECT * FROM giftcard WHERE code = ?`, (giftcard_code), (err, result) => {
            if (err) throw err;
            console.log(giftcard_code);
            switch (result[0]) {
                case null: case undefined:
                    console.log('invalid code')
                    res.send({ status: false, msg: 'Invalid code.' });
                    break;
                default:
                    //res.send(result[0]);
                    switch (result[0].is_used) {
                        case 0:
                            console.log('code available')
                            res.send({ status: true, msg: 'code can be use.' });
                            break;
                        case 1:
                            console.log('code unavailable')
                            res.send({ status: false, msg: 'code is already in used.' });
                            break;
                        default:
                            res.send({ err: 'err: [result[0].is_used]' });
                            break;
                    }
            }
        });
        return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }
}



module.exports = { checkEmail, checkUsername, checkGiftcard };
