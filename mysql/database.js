const mysql = require('mysql');

const pool = mysql.createConnection({
    host: '127.0.0.1',
    user: 'admin',
    password: 'meanttobe',
    database: 'tv_now'
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