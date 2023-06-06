const pool = require('../mysql/database.js');
require('dotenv').config()
const baseKeyApi = process.env.BASEKEY_API;
const { VerifaliaRestClient } = require('verifalia');


function EmailValidate(req, res) {
    let api_key = req.headers['api-key'];
    const email = req.body.email;

    //console.log(typeof email);
    if (api_key === baseKeyApi) {
        if (!email) {
            res.sendStatus(401);
            return;
        }

        const verifalia = new VerifaliaRestClient({
            username: 'bongkotsaelo.cmtc@gmail.com',
            password: 'Meanttobe00@'
        });

        verifalia
            .emailValidations
            .submit(email)
            .then(result => {
                const entry = result.entries[0];
                //console.log(entry);

                switch (entry.classification) {
                    case 'Deliverable':
                        pool.query(`SELECT * FROM user WHERE email = ?`, email, (err, result) => {
                            if (err) throw err;
                            switch (result[0]) {
                                case null: case undefined:
                                    res.send({ status: true, msg: 'This email can be use.' })
                                    break;
                                default:
                                    res.send({ status: false, msg: 'This email is already used.' });
                                    break;
                            }

                        });
                        break;
                    case 'Undeliverable': default:
                        res.send({ status: false, msg: 'Invalid email address.' });
                        break;
                }
            });

    }
    if (api_key != baseKeyApi) {
        res.sendStatus(402);
    }
}


module.exports = { EmailValidate };

/* 
//Email validate ZEROBOUNT.net
        axios.get(`https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}&ip_address=`)
            .then((resp) => {
                console.log(resp.data);
                //NOTICE** When 3rd party API is avaliable use this function

                switch (resp.data.status) {
                    case 'valid':
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
                        break;
                    case 'invalid': default:
                        res.send({ status: false });
                        break;
                }
            })
            .catch((err) => { console.log(err); console.log('err: API https://api.zerobounce.net/v2/validate...'); })
            */
