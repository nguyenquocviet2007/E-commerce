const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'quocviet01',
    database: 'TestInsertBigData'
})

const batchSize = 100_000; // adjust batch size: 100k
const totalSize = 10_000_000; // total size: 1M -- 4s / 10M -- 37.933s

let currentId = 1;

console.time('::::::TIMERS::::::');
const insertBatch = async() => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId;
        const address = `address-${currentId}`
        values.push([currentId, name, age, address]);
        currentId++;
    }

    if (!values.length) {
        console.timeEnd('::::::TIMERS::::::');
        pool.end(err => {
            if (err) {
                console.log('Error occurred while running batch');
            } else {
                console.log('Connection pool closed successfully');
            }
        });
        return;
    }
    const sql = `INSERT INTO test_table(id, name, age, address) VALUES ?`
    pool.query(sql, [values], async function(err, results) {
        if(err) {
            throw err
        }
        console.log(`Inserted ${results.affectedRows} records`);
        await insertBatch();
    })
}

insertBatch().catch(console.error);



// pool.query('SELECT * FROM users', function(err, results) {
//     if(err) {
//         throw err
//     }

//     console.log(`query result::`, results);

//     // close pool connection
//     pool.end(err => {
//         if(err) {
//             throw err
//         }
//         console.log('pool connection closed');
//     })
// })