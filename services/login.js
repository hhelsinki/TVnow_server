const pool = require('../mysql/database.js');
const crypto = require('crypto');
const randtoken = require('rand-token');
const timekey = require('rand-token').generator({
    chars: '0-9'
});
const { sendEmailTwoFactor } = require('./email-sender.js');
const { MongoClient } = require('mongodb');
const baseApiKey = require('../api-key.js');
//const url = 'mongodb://localhost:27017';
const url = process.env.MONGO_URL;
const client = new MongoClient(url);
const dbName = 'favourite';
const collection = client.db(dbName).collection('list');

function login(req, res) {
    let api_key = req.headers.api_key;
    const username = req.body.username;
    const password = req.body.password;

    if (api_key === baseApiKey) {
        pool.query('SELECT * FROM user WHERE (username = ? || email = ?)', [username, username], (err, result) => {
            if (err) throw err;
            let results = result[0];
            switch (results) {
                case null: case undefined:
                    res.send({ status: false, msg: 'Invalid username or email' });
                    break;
                default:
                    switch (results.is_verify) {
                        case 1:
                            if (password == results.password) {
                                console.log('correct username n password');
                                //check if 2factor is enable
                                switch (results.is_twofactor) {
                                    case 1:
                                        pool.query('SELECT * FROM authen WHERE email = ?', results.email, (err, result) => {
                                            if (err) throw err;

                                            switch (result[0]) {
                                                case null: case undefined:
                                                    res.sendStatus(500);
                                                    break;
                                                default:
                                                    let authenResult = result[0];
                                                    const timestamp = Date.now();
                                                    let unix_timestamp = Math.floor(timestamp / 1000);
                                                    
                                                    if (authenResult.mistake_expire !== 0) {
                                                        res.send({ status: 'false', msg: 'Please login again at', time: unix_timestamp + 3600 });
                                                        return;
                                                    }
                                                    //do process
                                                    const timekey_id = timekey.generate(6);
                                                    const timekey_token = randtoken.generate(20);
                                                    pool.query('UPDATE authen SET id_token = ?, timekey_token = ?, timekey_expire = UNIX_TIMESTAMP()+4500 WHERE email = ?', [timekey_id, timekey_token, results.email], (err, result) => {
                                                        if (err) throw err;
                                                        switch (result.effectedRows) {
                                                            case 1:
                                                                sendEmailTwoFactor(results.email, timekey_id, timekey_token);
                                                                res.send({ status: true, data: { username: results.email, token: timekey_token }, msg: 'Time based key is send to your email' });
                                                                break;
                                                            case 0: default:
                                                                console.log('err db: id_token cannot update');
                                                                break;
                                                        }
                                                    });

                                                    break;
                                            }
                                        });
                                        break;
                                    case 0: default:
                                        console.log('no need 2 factor');

                                        //update token to db
                                        const token = randtoken.generate(20);
                                        pool.query('UPDATE user SET access_token = ? WHERE id = ?', [token, results.id], (err, result) => {
                                            if (err) throw err;
                                            //console.log(result.affectedRows);
                                            switch (result.affectedRows) {
                                                case 1:
                                                    //upsert to mongo
                                                    let insertNoSql = async () => {
                                                        await client.connect();
                                                        console.log('Connected successfully to server');
                                                        const findUser = await collection.find({ user: results.email }).toArray();

                                                        switch (findUser[0]) {
                                                            case null: case undefined:
                                                                const insertUser = await collection.insertOne({ user: results.email, token: token, data: [] });
                                                                console.log(insertUser)
                                                                break;
                                                            default:
                                                                const updateResult = await collection.updateOne({ user: results.email }, { $set: { token: token } });
                                                                console.log(updateResult)
                                                                break;
                                                        }
                                                    }
                                                    insertNoSql();
                                                    res.send({ status: true, data: token });
                                                    break;
                                                case 0: default:
                                                    console.log('err db: user cannot update');
                                                    break;
                                            }
                                        });

                                        break;
                                }

                            }
                            if (password !== results.password) {
                                console.log('incorrect password');
                                res.send({ status: false, msg: 'Username or password is incorrect.' });
                            }
                            break;
                        case 0: default:
                            res.send({ status: false, msg: 'Please activate this user.' });
                            break;
                    }
                    break;
            }
            /*
            
            */
        });
        return;
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }

}
function logout(req, res) {
    let api_key = req.headers.api_key;
    const email = req.body.email;
    const access_token = randtoken.generate(20);

    if (api_key === baseApiKey) {
        pool.query('UPDATE user SET access_token = ? WHERE email = ?', [access_token, email], (err, result) => {
            if (err) throw err;
            switch (result.effectedRows) {
                case 1:
                    //upsert to mongo
                    let updateNoSql = async () => {
                        await client.connect();
                        console.log('Connected successfully to server');
                        const findUser = await collection.find({ user: email }).toArray();

                        switch (findUser[0]) {
                            case null: case undefined:
                                res.send({ status: false, msg: 'Forbidden, login, logout is required' });
                                break;
                            default:
                                const updateResult = await collection.updateOne({ user: email }, { $set: { token: access_token } });
                                break;
                        }
                    }
                    updateNoSql();
                    res.send({ status: true, msg: 'Logout successfully!' })
                    break;
                case 0: default:
                    console.log('db err: cannot update user access_token');
                    res.send({ status: false, msg: 'You must login before logout.' });
                    break;
            }
        });
    }
    if (api_key != baseApiKey) {
        res.sendStatus(402);
        return;
    }

}

module.exports = { login, logout };