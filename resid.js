const crypto = require('crypto');
const db = require('./db').db;

// db.query('select * from resid', (err, rows) => {
//   if (err) return;
//   console.log(rows);
// });

const residSchema = {
  querystring: {
    type: { type: 'string' },
    bid: { type: 'number' },
    name: { type: 'string' },
    reciept: { type: 'string' },
    payment: { type: 'number' },
    datetime: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      type: { type: 'string' },
      bid: { type: 'number' },
      name: { type: 'string' },
      reciept: { type: 'string' },
      payment: { type: 'number' },
      datetime: { type: 'string' },
    },
  },
  required: ['type', 'bid', 'name', 'reciept', 'payment', 'datetime'],
};

const addBimeh = (req, res) => {
  const {
    type,
    bid,
    name,
    reciept,
    payment,
    datetime
  } = req.body;

  db.query(`INSERT INTO resid VALUES (NULL, :type, :bid, :name, :reciept, :payment, :date, :uid)`, {
    type,
    bid,
    name,
    payment,
    reciept,
    date: datetime,
    uid: req.session.uid
  });

  res.send("" + req.body.name)
}

exports.bimeh = addBimeh;
exports.schema
// db.query('INSERT INTO resid VALUES(null, ?)', ['Amin']);
