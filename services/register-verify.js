const baseApiKey = require('../api-key.js');
const pool = require('../mysql/database.js');

function registerVerify(req, res) {
	let api_key = req.headers.api_key;
	const user = req.query.user;
	const token = req.query.token;

	if (api_key === baseApiKey) {
		if (!user) {res.sendStatus(401); return; }
		if (!token) {res.sendStatus(401); return; }

		pool.query('SELECT * FROM user WHERE username = ?', [user], (err, result) => {
			if (err) throw err;
			switch (result[0]) {
				case null: case undefined:
					console.log('err db: user unknow username');
					break;
				default:
					if (token === result[0].access_token) {
						pool.query('UPDATE user SET is_verify = 1 WHERE username = ?', [user], (err, result) => {
							if (err) throw err;
							switch (result.effectedRows) {
								case 1:
									res.send({ status: true, msg: 'correct username and token, redirect to client login page' });
									break;
								case 0: default:
									console.log('err db: user cannot update');
									break;
							}
						});

						break;
					}
					if (token !== result[0].access_token) {
						res.send({ status: false, msg: 'correct username but token is not' });
						break;
					}
					break;
			}

		});
	}
	if (api_key != baseApiKey) {
		res.sendStatus(402);
	}


}

module.exports = { registerVerify };
