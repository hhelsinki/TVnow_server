var crypto = require('crypto');
// Create the generator:
var randtoken = require('rand-token').generator({
  chars: 'base32',
  source: crypto.randomBytes 
});

const pool = require('../mysql/database');

// Generate a 16 character token:
var token = randtoken.generate(16);

function insertGiftcard() {
  pool.query('insert into giftcard (code) values (?)', [token], (err, result) => {
    if (err) throw err;
    console.log(result);
  })
}

insertGiftcard();

console.log(token);
