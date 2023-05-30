const pool = require('./database.js');
const crypto = require('crypto');
const randtoken = require('rand-token');
const { sendEmailRegis } = require('../services/email-sender.js');
const baseApiKey = require('../api-key.js');

function upsertUser(req, res) {
	let api_key = req.headers.api_key;
	const email = req.body.email;
	const plan = req.body.plan;
	const username = req.body.username;

	if (api_key = baseApiKey) {
		//giftcard
		if (!email) { res.sendStatus(401); return; }
		if (!plan) { res.sendStatus(401); return; }
		if (!username) { res.sendStatus(401); return; }

		pool.query('SELECT * FROM giftcard WHERE email_used = ?', [email], (err, result) => {
			if (err) throw err;

			let giftcard_result = result[0];
			switch (giftcard_result) {
				case null: case undefined:
					console.log('err db: giftcard, unknow email');
					res.send({ status: false, msg: 'missing step' });
					break;
				default:
					switch (giftcard_result.is_used) {
						case 0:
							pool.query('UPDATE giftcard SET is_used = 1 WHERE email_used = ?', [email], (err, result) => {
								if (err) throw err;
								switch (result.changedRows) {
									case 1:
										//payment
										pool.query('SELECT * FROM payment where email = ?', [email], (err, result) => {
											if (err) throw err;

											switch (result[0]) {
												case null: case undefined:
													pool.query('INSERT INTO payment (email, plan, method, code) VALUES (?, ?, ?, ?)', [email, plan, 'giftcard', giftcard_result.code], (err, result) => {
														if (err) throw err;
														console.log(result);
														switch (result.insertId) {
															case 0:
																console.log('err db: payment cannot insert');
																break;
															default:
																//authen
																pool.query('INSERT INTO authen (email) VALUES (?)', email, (err, result) => {
																	if (err) throw err;

																	switch (result.insertId) {
																		case 0:
																			console.log('err db: authen cannot insert');
																			break;
																		default:
																			//user
																			const password = crypto.randomBytes(10).toString('base64url');
																			const access_token = randtoken.generate(20);
																			pool.query('INSERT INTO user (username, password, email, access_token) VALUES (?, ?, ?, ?)', [username, password, email, access_token], (err, result) => {
																				if (err) throw err;
																				switch (result.insertId) {
																					case 0:
																						console.log('cannot insert to user');
																						break;
																					default:
																						//send to email
																						pool.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
																							if (err) throw err;
																							switch (result[0]) {
																								case null: case undefined:
																									console.log('err db: user unknow email');
																									break;
																								default:
																									sendEmailRegis(email, username, result[0].password, result[0].access_token)
																									res.send({ status: true, msg: 'payment is successfully, please check your email.' });
																									break;
																							}

																						});
																						break;
																				}
																			});

																			break;
																	}
																})


																break;
														}
													});
													break;
												default:
													console.log('err db: payment, duplicate email');
													res.send({ status: false, msg: 'This email is already used' });
													break;
											}
										})
										break;
									case 0: default:
										console.log('err db: giftcard cannot update');
										res.send({ status: false, msg: 'missing step' });
								}
							});
							break;
						case 1:
							console.log('err *Critical: is_used is set to 1 before submit. bypass to payment');
							res.send({ status: false, msg: 'Something is not right. Our support will contact to you soon. (This is a rare event.)' })
							break;
						default:
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

module.exports = { upsertUser };
