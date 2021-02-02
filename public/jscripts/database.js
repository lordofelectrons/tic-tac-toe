const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(`${__dirname}/../storage/database.db`,
  sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
  (err) => {(err) ? console.log(err) : console.log("Connected DB!")});

let databaseInterface = {
    feedbackLog : {
        init : function() {
            db.run(`CREATE TABLE IF NOT EXISTS feedbacklog (
                id INTEGER PRIMARY KEY, Name TEXT,
                Organization TEXT, Type TEXT, Message TEXT,
                file_path TEXT);`);
        },
        getAllRecords : function(callback) {
            let query = `SELECT * FROM feedbacklog`;
            db.all(query, [], (err, rows) => {
                callback(err, rows);
            });
        },
        insertRecord : function (record, callback) {
            let query = `INSERT INTO feedbacklog
                (Name, Organization, Type, Message, file_path) VALUES
                ((?), (?), (?), (?), (?))`;
            console.log(`Inserting into feedbacklog: `);
            console.log(record);
            let values = [record['Name'], record['Organization'], record['Type'],
              record['Message'], record['file_path']];
            db.run(query, values, callback);
        }
    },
    gameLog : {
        init : function(callback) {
            db.run(`CREATE TABLE IF NOT EXISTS gamelog (
                id INTEGER PRIMARY KEY,
                record TEXT,
                time TEXT)`, callback);
        },
        insertRecord : function (record, callback) {
            let query = `INSERT INTO gamelog
                (record, time) VALUES
                ((?), (?))`;
            console.log(`Inserting into gamelog: `);
            console.log(record);
            let values = [record['record'], record['time']];
            db.run(query, values, callback);
        },
        getAllRecords : function(callback) {
            let query = `SELECT * FROM gamelog`;
            db.all(query, [], (err, rows) => {
                callback(err, rows);
            });
        },
    }
}

module.exports = databaseInterface;
