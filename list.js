const db = require('./db').db;
const util = require('./util');

const list = (req, res) => {
  return new Promise( async (resolve, reject) => {
    db.query('SELECT * FROM resid', {
      id: Number,
      type: String,
      bid: Number,
      name: String,
      reciept: String,
      payment: String,
      date: String,
      uid: String,
    }, async (err, rows) => {
      if (err) {
        console.error(err)
        return;
      }

      let data = rows;

      db.query('SELECT id, name, lastname FROM user', {
        id: Number,
        name: String,
        lastname: String,
      },  async (err, ro) => {
        if (err) {
          console.error(err)
          return;
        }

        await data.map( async (i, ind) => {
          ro.map( d => {
            if (d.id == i.uid) {
              data[ind].uname = d.name;
              data[ind].lastname = d.lastname;
            }
          })
        });

        resolve(data);
      });
    });
  });
}

const bdelete = (req, res) => {
  let id = req.params.id;

  db.query('DELETE FROM resid WHERE id = :id', { id });

  res.redirect('/list');
}

exports.list = list;
exports.delete = bdelete;
