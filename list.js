const db = require('./db').db;

const list = (req, res) => {
  return new Promise( (resolve, reject) => {
    db.query('SELECT * FROM resid', {
      id: Number,
      type: String,
      bid: Number,
      name: String,
      reciept: String,
      payment: String,
      date: String,
    }, (err, rows) => {
      if (err) {
          console.error(err)
          return;
      }

      let data = rows;
      resolve(data)
    });
  });
}

exports.list = list;
