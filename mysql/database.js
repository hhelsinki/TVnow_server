const mysql = require('mysql2');
require('dotenv').config();

console.log(process.env.DD);

const pool = mysql.createConnection({
    // host: process.env.SQL_DOMAIN,
    // user: process.env.SQL_USER,
    // password: process.env.SQL_PASSWORD,
    // database: process.env.SQL
     host: '127.0.0.1',
     user: 'root',
     password: 'meanttobe',
     database: 'test'
});
pool.connect((err) => {
    if (!!err) {
        console.log(err)
    }
})

module.exports = pool;


/*
export async function InsertOneValue(entity, column, value) {
    const [result] = await pool.query(`insert into ${entity} (${column}) values (?)`, [value]);
}
*/



/*
export async function InsertThreeValues(entity, columnI, columnII, columnIII, valueI, valueII, valueIII) {
    const [result] = await pool.query(`insert into ${entity} (${columnI}, ${columnII}, ${columnIII}) values (?, ?, ?)`, [valueI, valueII, valueIII])
}
*/
