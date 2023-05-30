const pool = require('./database.js');
const baseApiKey = require('../api-key.js');
const { sendEmailForgotPassword } = require('../services/email-sender.js');

const getEmailGiftcard = (req, res) => {
    let api_key = req.headers.api_key;
    const email_used = req.body.email_used;

    if (api_key === baseApiKey) {
        if (!email_used) {res.sendStatus(401); return;}

        pool.query('SELECT * FROM giftcard WHERE email_used = ?', [email_used], (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    console.log('not found');
                    res.send({ status: false, msg: 'cannot find email' });
                    break;
                default:
                    console.log('find email_used');
                    let userCode = result[0].code;
                    let codeSensor = userCode.replace(/([A-Z0-9]{4})([A-Z0-9]{4})([A-Z0-9]{4})([A-Z0-9]{4})/, '$1-XXXX-XXXX-$4');
                    let codeOutput = codeSensor.replace(/([A-Z0-9]{4})([A-Z0-9]{4})([A-Z0-9]{4})([A-Z0-9]{4})/, '$1-$2-$3-$4');
                    console.log(codeOutput);

                    res.send({
                        status: true, data: {
                            payment: 'Giftcard',
                            code: codeOutput
                        }
                    });
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

const getUserProfile = (req, res) => {
    let api_key = req.headers.api_key;
    let token = req.headers.user_token;

    if (api_key === baseApiKey) {
        if (!token) {res.sendStatus(401); return;}

        pool.query('SELECT * FROM user WHERE BINARY access_token = ?', [token], (err, result) => {
            if (err) throw err;
            let newUser = result[0];

            switch (result[0]) {
                case null: case undefined:
                    res.send({ status: false, msg: 'invalid token' });
                    break;
                default:
                    pool.query('SELECT * FROM payment WHERE (email = ?)', [newUser.email], (err, result) => {
                        if (err) throw err;
                        let newPayment = result[0];

                        switch (result[0]) {
                            case null: case undefined:
                                console.log('cannot find email');
                                console.log(email)
                                break;
                            default:
                                pool.query('SELECT * FROM giftcard WHERE email_used = ?', [newUser.email], (err, result) => {
                                    if (err) throw err;
                                    let newGiftcard = result[0];

                                    switch (result[0]) {
                                        case null: case undefined:
                                            console.log('unknow giftcard');
                                            break;
                                        default:
                                            res.send({ status: true, data: { username: newUser.username, email: newUser.email, payment: newPayment.method, date_expire: newGiftcard.code_expire, is_twofactor: newUser.is_twofactor } });
                                            console.log(new Date().getTime());
                                            break;
                                    }
                                })

                                break;
                        }
                    })
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

const getForgotPassword = (req, res) => {
    let api_key = req.headers.api_key;
    const email = req.body.email;

    if (api_key === baseApiKey) {
        if (!email) {res.sendStatus(401); return; }

        pool.query('SELECT * FROM user WHERE email = ?', email, (err, result) => {
            if (err) throw err;

            switch(result[0]) {
                case null: case undefined:
                    res.send({status: false, msg: 'Invalid Email or this email is not exit.'});
                    break;
                default:
                    let userResult = result[0];
                    sendEmailForgotPassword(email, userResult.username, userResult.password);
                    res.send({status:true, msg: 'The password has been send to your email.'});
                    break;
            }
        })
    }
    if (api_key != baseApiKey) {
        res.sendStatus(405);
        return;
    }
}

module.exports = { getEmailGiftcard, getUserProfile, getForgotPassword };
