const path = require('path');
const dblite = require('dblite');

dblite.bin = path.join(__dirname, 'db', 'sqlite3.exe');
const db = dblite(path.join(__dirname, 'db', 'resid.db'));

exports.db = db;
exports.dblite = dblite;
