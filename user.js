const crypto = require('crypto');
const db = require('./db').db;

const ROLE = {
  ADMIN: 1,
  USER: 2
};

const userSchema = {
  querystring: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  body: {
    type: 'object',
    properties: {
      username: { type: 'string', nullable: false },
      passowrd: { type: 'string', nullable: false },
      repassword: { type: 'string', nullable: false },
      role: { type: 'integer', nullable: false },
    },
  },
  required: ['username', 'password', 'repassword', 'role'],
};

const loginFront = (req, res) => {
  if (req.session.auth) {
    res.redirect('/home');
    return;
  }

  res.view('login.pug', {
    title: 'صفحه ورود',
    headerTitle: 'صفحه ورود',
    auth: req.session.auth,
  });
}

const addFront = (req, res) => {
  res.view('register.pug', {
    title: 'صفحه ثبت نام',
    headerTitle: 'ثبت نام کاربر جدید',
    auth: req.session.auth,
  });
}

const addUser = (req, res) => {
  const {
    username,
    password,
    repassword,
    name,
    lastname
  } = req.body;

  if ( password !== repassword) {
    res.send('پسوردها با هم برابر نیست.');
    return;
  }

  if (username !== '' && password !== '') {
    crypto.scrypt(password, 'aminiou', 64, (err, drivedKey) => {
      if (err) throw err;
      let hash = drivedKey.toString('hex');
      db.query(`INSERT INTO user VALUES (NULL, :username, :password, :createdate, :logindate, :salt, :role, :name, :lastname)`, {
        username,
        password: hash,
        createdate: new Date(),
        logindate: new Date(),
        salt: 'aminiou',
        role: ROLE.USER,
        name,
        lastname
      });

      res.send(drivedKey.toString('hex'))
    });
  }
};

const login = (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  let p = crypto.scryptSync(password, 'aminiou', 64).toString('hex');

  return new Promise( (resolve, reject) => {
    db.query(`SELECT * FROM user WHERE (username = @username AND password = @password)`, { username, password: p }, (err, rows) => {
      if (err) {
        console.log(err)
        reject();
        return;
      }

      if (rows.length <= 0) {
        reject();
        return;
      }

      resolve(rows[0][0], rows[0][5]);
      return;
    });
  });
};

exports.userSchema = userSchema;
exports.add = addUser;
exports.login = login;
exports.addFront = addFront;
exports.loginFront = loginFront;

// db.query('INSERT INTO resid VALUES(null, ?)', ['Amin']);
