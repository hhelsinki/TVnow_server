const { access_token } = require('../services/password-generate.js');
const { sendEmailChangePassword } = require('../services/email-sender.js');
const pool = require('./database.js');
const randtoken = require('rand-token');
require('dotenv').config()
const baseKeyApi = process.env.BASEKEY_API;
const { MongoClient } = require('mongodb');
//const url = 'mongodb://localhost:27017';
const url = process.env.MONGO_URL;
const client = new MongoClient(url);
const dbName = 'favourite';
const collection = client.db(dbName).collection('list');

const updateGiftcardEmail = (req, res) => {
    let api_key = req.headers['api-key'];
    const email_used = req.body.email_used;
    const giftcard_code = req.body.giftcard_code;

    if (api_key === baseKeyApi) {
        if (!email_used) { res.sendStatus(401); return; }
        if (!giftcard_code) { res.sendStatus(401); return; }

        pool.query('SELECT * FROM giftcard WHERE email_used = ?', email_used, (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    pool.query(`UPDATE giftcard SET email_used = ?, code_expire = UNIX_TIMESTAMP() + 2592000 WHERE code = ?`, [email_used, giftcard_code], (err, result) => {
                        if (err) throw err;
                        console.log(result);
                        switch (result.affectedRows) {
                            case 1:
                                res.send({ status: true, msg: 'email_used updated.' });
                                break;
                            case 0: default:
                                res.send({ status: false, msg: 'neither email or giftcard code is invalid.' });
                                break;
                        }
                    });
                    break;
                default:
                    res.send({ status: false, msg: 'This email is been used' });
                    break;
            }
        });

    }
    if (api_key != baseKeyApi) {
        res.sendStatus(402);
        return;
    }


}
const updateUserPassword = (req, res) => {
    let api_key = req.headers['api-key'];
    let token = req.headers['user-token'];
    const email = req.body.email;
    const password_new = req.body.password_new;

    if (api_key === baseKeyApi) {
        if (!token) { res.sendStatus(401); return; }
        if (!email) { res.sendStatus(401); return; }
        if (!password_new) { res.sendStatus(401); return; }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
        switch (passwordRegex.test(password_new)) {
            case true:
                pool.query('SELECT * FROM user WHERE BINARY access_token = ?', token, (err, result) => {
                    if (err) throw err;

                    switch (result[0]) {
                        case null: case undefined:
                            res.sendStatus(401);
                            break;
                        default:
                            let userResult = result[0];

                            switch (userResult.is_twofactor) {
                                case 1:
                                    pool.query('UPDATE authen SET id_token = NULL, timekey_expire = 0, mistake_count = 0, mistake_expire = NULL WHERE email = ?', email, (err, result) => {
                                        if (err) throw err;

                                        pool.query('UPDATE user SET password = ? WHERE email = ?', [password_new, email], (err, result) => {
                                            if (err) throw err;

                                            //console.log(result.affectedRows);
                                            switch (result.affectedRows) {
                                                case 1:
                                                    res.send({ status: true, msg: 'Password is successfully saved!' });
                                                    break;
                                                case 0: default:
                                                    res.send({ stat: false, msg: 'Failed to save password' }).
                                                        break;
                                            }
                                        });

                                    })
                                    break;
                                default:
                                    pool.query('UPDATE user SET password = ? WHERE email = ?', [password_new, email], (err, result) => {
                                        if (err) throw err;

                                        //console.log(result.affectedRows);
                                        switch (result.affectedRows) {
                                            case 1:
                                                res.send({ status: true, msg: 'Password is successfully saved!' });
                                                break;
                                            case 0: default:
                                                res.send({ stat: false, msg: 'Failed to save password' }).
                                                    break;
                                        }
                                    });
                                    break;
                            }


                            break;
                    }
                });
                break;
            case false: default:
                res.send({ status: false, msg: 'Password must contains the minimum required.' });
                break;
        }
    }
    if (api_key != baseKeyApi) {
        res.sendStatus(402);
        return;
    }
}
function updateTwoFactor(req, res) {
    let api_key = req.headers['api-key'];
    const email = req.body.email;
    const id_token = req.body.id_token;
    const timekey_token = req.body.timekey_token;

    if (api_key === baseKeyApi) {
        if (!email) { res.sendStatus(401); return; }
        if (!id_token) { res.sendStatus(401); return; }
        if (!timekey_token) { res.sendStatus(401); return; }

        pool.query('SELECT * FROM authen WHERE (email = ? && BINARY timekey_token = ?)', [email, timekey_token], (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    res.send({ status: false, msg: 'Invalid token' })
                    break;
                default:
                    const timestamp = Date.now();
                    let unix_timestamp = Math.floor(timestamp / 1000);
                    let isTwoFactor = result[0].is_twofactor;
                    let isExpire = result[0].timekey_expire;
                    let mistakeCount = result[0].mistake_count;
                    let mistakeExpire = result[0].mistake_expire;

                    if (mistakeExpire === 0 || mistakeExpire === null) {
                        //normal logic
                        if (isTwoFactor === 0) {
                            res.sendStatus(405);
                            return;
                        }
                        //if ((unix_timestamp >= isExpire) && (unix_timestamp < (isExpire + 900))) {
                        if (unix_timestamp <= isExpire) {
                            pool.query('SELECT * FROM authen WHERE (email =? && id_token = ?)', [email, id_token], (err, result) => {
                                if (err) throw err;

                                //do process
                                if (mistakeCount === 3) {
                                    //update db mistake_expire
                                    pool.query('UPDATE authen SET mistake_expire = ? WHERE email =?', [unix_timestamp + 3600, email], (err, result) => {
                                        if (err) throw err;
                                        console.log(result.affectedRows);
                                        switch (result.affectedRows) {
                                            case 1:
                                                res.send({ status: false, msg: 'Please login again at', time: unix_timestamp + 3600 });
                                                break;
                                            case 0:
                                                res.sendStatus(500);
                                                break;
                                        }
                                    });
                                    return;
                                }

                                switch (result[0]) {
                                    case null: case undefined:
                                        pool.query('UPDATE authen SET mistake_count = ? WHERE email = ?', [mistakeCount + 1, email], (err, result) => {
                                            if (err) throw err;
                                            console.log(result.affectedRows);
                                            res.send({ status: false, msg: 'Invalid Digit' });
                                        });
                                        break;
                                    default:
                                        pool.query('UPDATE authen SET mistake_count = 0 WHERE email = ?', email, (err, result) => {
                                            if (err) throw err;
                                            console.log(result.affectedRows);
                                            switch (result.affectedRows) {
                                                case 1:
                                                    const access_token = randtoken.generate(20);
                                                    pool.query('UPDATE user SET access_token = ? WHERE email = ?', [access_token, email], (err, result) => {
                                                        if (err) throw err;
                                                        console.log(result.affectedRows);
                                                        switch (result.affectedRows) {
                                                            case 1:
                                                                //upsert to mongo
                                                                let insertNoSql = async () => {
                                                                    await client.connect();
                                                                    console.log('Connected successfully to server');
                                                                    const findUser = await collection.find({ user: email }).toArray();

                                                                    switch (findUser[0]) {
                                                                        case null: case undefined:
                                                                            const insertUser = await collection.insertOne({ user: email, token: access_token, data: [] });
                                                                            console.log(insertUser)
                                                                            break;
                                                                        default:
                                                                            const updateResult = await collection.updateOne({ user: email }, { $set: { token: access_token } });
                                                                            console.log(updateResult)
                                                                            break;
                                                                    }
                                                                }
                                                                insertNoSql();
                                                                res.send({ status: true, data: access_token });
                                                                break;
                                                            case 0: default:
                                                                res.sendStatus(500);
                                                                break;
                                                        }
                                                    });
                                                    break;
                                                case 0:
                                                    res.sendStatus(500);
                                                    break;
                                            }
                                        });

                                        break;
                                }
                            });
                            return;
                        }
                        //if (unix_timestamp > (isExpire + 900)) { //5 mins = 300, 15 mins = 900
                        if (unix_timestamp > isExpire) {
                            //console.log('run out of time');
                            res.send({ status: false, msg: 'The token is expired. Please login again then check your email.' });
                            return;
                        }
                        else {
                            console.log('something wrong')
                            res.sendStatus(401);
                            return;
                        }
                    }
                    if (mistakeExpire !== 0) {
                        if (unix_timestamp > mistakeExpire) {
                            pool.query('UPDATE authen SET mistake_count = 0, mistake_expire = null WHERE email = ?', email, (err, result) => {
                                if (err) throw err;
                                console.log(result.affectedRows);
                                switch (result.affectedRows) {
                                    case 1:
                                        if (isTwoFactor === 0) {
                                            res.sendStatus(405);
                                            return;
                                        }
                                        //if ((unix_timestamp >= isExpire) && (unix_timestamp < (isExpire + 900))) {
                                        if (unix_timestamp <= isExpire) {
                                            pool.query('SELECT * FROM authen WHERE (email =? && id_token = ?)', [email, id_token], (err, result) => {
                                                if (err) throw err;

                                                //do process
                                                switch (result[0]) {
                                                    case null: case undefined:
                                                        let newMistakeCount = 0;
                                                        pool.query('UPDATE authen SET mistake_count = ? WHERE email = ?', [newMistakeCount + 1, email], (err, result) => {
                                                            if (err) throw err;
                                                            console.log(result.affectedRows);
                                                            res.send({ status: false, msg: 'Invalid Digit' });
                                                        });
                                                        break;
                                                    default:
                                                        const access_token = randtoken.generate(20);
                                                        pool.query('UPDATE user SET access_token = ? WHERE email = ?', [access_token, email], (err, result) => {
                                                            if (err) throw err;
                                                            console.log(result.affectedRows);
                                                            switch (result.affectedRows) {
                                                                case 1:
                                                                    //upsert to mongo
                                                                    let insertNoSql = async () => {
                                                                        await client.connect();
                                                                        console.log('Connected successfully to server');
                                                                        const findUser = await collection.find({ user: email }).toArray();

                                                                        switch (findUser[0]) {
                                                                            case null: case undefined:
                                                                                const insertUser = await collection.insertOne({ user: email, token: access_token, data: [] });
                                                                                console.log(insertUser)
                                                                                break;
                                                                            default:
                                                                                const updateResult = await collection.updateOne({ user: email }, { $set: { token: access_token } });
                                                                                console.log(updateResult)
                                                                                break;
                                                                        }
                                                                    }
                                                                    insertNoSql();
                                                                    res.send({ status: true, data: access_token });
                                                                    break;
                                                                case 0: default:
                                                                    res.send({ status: false, msg: 'Failed or Error' });
                                                                    break;
                                                            }
                                                        });

                                                        break;
                                                }


                                            });
                                            return;
                                        }
                                        //if (unix_timestamp > (isExpire + 900)) { //5 mins = 300, 15 mins = 900
                                        if (unix_timestamp > isExpire) {
                                            console.log('run out of time');
                                            res.send({ status: false, msg: 'The token is expired. Please login again then check your email.' });
                                            return;
                                        }
                                        else {
                                            console.log('something wrong')
                                            res.sendStatus(401);
                                        }
                                        break;
                                    case 0:
                                        res.sendStatus(500);
                                        break;
                                }

                            });
                            return;
                        }
                        if (unix_timestamp < mistakeExpire) {
                            res.send({ status: false, msg: 'Please wait after 1 hour.' });
                            return;
                        }
                    }




                //NORMAL LOGIC
                //console.log(unix_timestamp);
                /*if (result[0].is_twofactor === 0) {
                    res.sendStatus(405);
                    return;
                }
                if ((unix_timestamp >= isExpire) && (unix_timestamp < (isExpire + 900))) {
                    pool.query('SELECT * FROM authen WHERE (email =? && id_token = ?)', [email, id_token], (err, result) => {
                        if (err) throw err;

                        if (unix_timestamp > mistakeExpire) {
                            //do process
                            switch (result[0]) {
                                case null: case undefined:
                                    pool.query('UPDATE authen SET mistake_count = ? WHERE email = ?', [mistakeCount + 1, email], (err, result) => {
                                        if (err) throw err;
                                        res.send({ status: false, msg: 'Invalid Digit' });
                                    });
                                    break;
                                default:
                                    const access_token = randtoken.generate(20);
                                    pool.query('UPDATE user SET access_token = ? WHERE email = ?', [access_token, email], (err, result) => {
                                        if (err) throw err;
                                        switch (result.affectedRows) {
                                            case 1:
                                                res.send({ status: true, data: access_token });
                                                break;
                                            case 0: default:
                                                res.send({ status: false, msg: 'Failed or Error' });
                                                break;
                                        }
                                    });

                                    break;
                            }
                        }
                        if (unix_timestamp < mistakeExpire) {
                            if (mistakeCount === 3) {
                                res.sendStatus(408);
                                return;
                            }
                            return;
                        }
                    });
                    return;
                }
                if (unix_timestamp > (isExpire + 900)) { //5 mins = 300, 15 mins = 900
                    console.log('run out of time');
                    res.send({ status: false, msg: 'The token is expired. Please login again then check your email.' });
                    return;
                }
                else {
                    console.log('something wrong')
                    res.sendStatus(401);
                    return;
                }
                break;*/
                //NORMAL LOGIC
            }
        });
        return;
    }
    if (api_key != baseKeyApi) {
        res.sendStatus(402);
        return;
    }


}

function reqUserPassword(req, res) {
    let api_key = req.headers['api-key'];
    let token = req.headers['user-token'];
    const password = req.body.password;

    if (api_key === baseKeyApi) {
        if (!token) { res.sendStatus(401); return; }
        if (!password) { res.sendStatus(401); return; }

        pool.query('SELECT * FROM user WHERE (BINARY password = ? && BINARY access_token = ?)', [password, token], (err, result) => {
            if (err) throw err;
            switch (result[0]) {
                case null: case undefined:
                    res.send({ status: false, msg: 'Invalid Password' });
                    break;
                default:
                    const token = access_token;
                    let email = result[0].email;
                    console.log(token);
                    pool.query('UPDATE user SET access_token = ? WHERE email = ?', [token, email], (err, result) => {
                        if (err) throw err;
                        console.log(result.affectedRows);
                        switch (result.affectedRows) {
                            case 1:
                                sendEmailChangePassword(email, token);
                                res.send({ status: true, msg: 'Please check your email to change the password.' });
                                break;
                            case 0: default:
                                console.log(email)
                                res.send({ status: false, msg: 'access token is not update' });
                                break;
                        }
                    });

                    break;
            }
        });
        return;
    }
    if (api_key != baseKeyApi) {
        res.sendStatus(402);
        return;
    }


}

const reqUserTwoFactor = (req, res) => {
    let api_key = req.headers['api-key'];
    let access_token = req.headers['user-token'];
    const bool = req.body.bool;
    const email = req.body.email;

    if (api_key === baseKeyApi) {
        if (!access_token) { res.sendStatus(401); console.log('no access_token'); return; }
        //if (!bool) { res.sendStatus(401); console.log('no bool'); return; }
        //if (!email) { res.sendStatus(401); console.log('no email'); return; }

        pool.query('UPDATE user SET is_twofactor = ? WHERE BINARY access_token = ?', [bool, access_token], (err, result) => {
            if (err) throw err;
            console.log(result.affectedRows);
            switch (result.affectedRows) {
                case 1:
                    pool.query('UPDATE authen SET is_twofactor = ? WHERE email = ?', [bool, email], (err, result) => {
                        if (err) throw err;
                        switch (result.affectedRows) {
                            case 1:
                                res.send({ status: true, msg: '2 Factor is saved!' });
                                break;
                            case 0: default:
                                console.log('db error: cannot save tb authen, col is_twofactor ');
                                res.send({ status: false, msg: 'Failed to save 2 Factor' });
                                break;
                        }
                    });
                    break;
                case 0: case undefined:
                    res.send({ status: false, msg: 'Please provide new twofactor' });
                    break;

            }
        });
        return;
    }
    if (api_key != baseKeyApi) {
        res.sendStatus(402);
        return;
    }


}
const reqUserRedeemGiftcard = (req, res) => {
    let api_key = req.headers['api-key'];
    let user_token = req.headers['user-token'];
    const code = req.body.code;

    console.log(code);

    if (api_key === baseKeyApi) {
        if (!user_token) { res.sendStatus(401); return; }
        if (!code) { res.sendStatus(401); return; }

        pool.query('SELECT * FROM user WHERE BINARY access_token = ?', [user_token], (err, result) => {
            if (err) throw err;

            switch (result[0]) {
                case null: case undefined:
                    res.send({ status: false, msg: 'Invalid token' });
                    break;
                default:
                    //if redeem new code, set email = null before add new
                    let newEmail = result[0].email;
                    pool.query('SELECT * FROM giftcard WHERE email_used = ?', newEmail, (err, result) => {
                        if (err) throw err;

                        switch (result[0]) {
                            case null: case undefined:
                                res.send({ status: false, msg: 'You must register before redeem code.' });
                                break;
                            default:
                                let currentCode = result[0].code;
                                let currentExpire = result[0].code_expire;
                                //pool.query('SELECT * FROM giftcard WHERE code = ?', currentCode, (err, result) => {
                                //if (err) throw err;

                                //switch (result[0]) {
                                switch (currentCode) {
                                    case null: case undefined:
                                        //res.send({ status: false, msg: 'Cannot find current code' });
                                        console.log('cannot find current code');
                                        break;
                                    default:
                                        pool.query('SELECT * FROM giftcard WHERE code = ? && is_used = 0', code, (err, result) => {
                                            if (err) throw err;

                                            switch (result[0]) {
                                                case null: case undefined:
                                                    res.send({ status: false, msg: 'Invalid code or this code is already in used.' });
                                                    break;
                                                default:
                                                    //redeem available on 7 days before expire
                                                    let now = (new Date().getTime()) / 1000;
                                                    now = ~~now;
                                                    if (now >= currentExpire || now >= (currentExpire - (86400 * 7))) { //86400 = 1 day

                                                        pool.query('UPDATE giftcard SET email_used = null WHERE email_used = ?', [newEmail], (err, result) => {
                                                            if (err) throw err;
                                                            console.log(result.affectedRows);
                                                            switch (result.affectedRows) {
                                                                case 1:
                                                                    pool.query(`UPDATE giftcard SET is_used = 1, email_used = ?,code_expire = UNIX_TIMESTAMP() + 2592000 WHERE code = ?`, [newEmail, code], (err, result) => {
                                                                        if (err) throw err;

                                                                        switch (result.affectedRows) {
                                                                            case 1:
                                                                                pool.query('UPDATE payment SET code = ? WHERE email = ?', [code, newEmail], (err, result) => {
                                                                                    if (err) throw err;
                                                                                    console.log(result.affectedRows);
                                                                                    switch (result.affectedRows) {
                                                                                        case 1:
                                                                                            res.send({ status: true, msg: 'Redeem Code Successfully!' });
                                                                                            break;
                                                                                        case 0: default:
                                                                                            console.log('db err: cannot update tb payment, col code');
                                                                                            break;
                                                                                    }
                                                                                })
                                                                                break;
                                                                            case 0: default:
                                                                                console.log('db err: cannot update tb giftcard');
                                                                                break;
                                                                        }
                                                                    });

                                                                    break;
                                                                case 0: default:
                                                                    console.log('db err: cannot update tb giftcard');
                                                                    break;
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        res.send({ status: false, msg: 'Cannot redeem yet, you can redeem before 7 day of expired date.' });
                                                    }

                                                    break;
                                            }
                                        });

                                }

                                //});
                                break;
                        }
                    });
                    break;
            }

        });
        return;
    }

    if (api_key != baseKeyApi) {
        res.sendStatus(402);
        return;
    }
}


module.exports = { updateGiftcardEmail, updateUserPassword, updateTwoFactor, reqUserPassword, reqUserTwoFactor, reqUserRedeemGiftcard };
