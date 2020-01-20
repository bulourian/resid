const path = require('path');
const fastify = require('fastify')();

const user = require('./user');
const resid = require('./resid');
const list = require('./list');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(dataa) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        list.list().then( data => {
          client.send(JSON.stringify(data));
        });
      }
    });
  });
});

fastify.register(require('fastify-helmet'));
fastify.register(require('fastify-cors'));
fastify.register(require('fastify-cookie'));
fastify.register(require('fastify-formbody'));
fastify.register(require('fastify-static'), {root: path.join(process.cwd(), 'public')});
fastify.register(require('fastify-session'), {
  secret: '44f5983a3709f736066b91cb34817e98c7761bb7055a1d3ca3620b7b727ca6fa51f7fd866c8f0d7c1633440ca1f2173e7007c2c706ed4f5d8c783552739f4e56',
  cookie: { secure: false },
  expires: 1800000,
});

fastify.register(require('point-of-view'), {
  engine: {
    pug: require('pug')
  },
  templates: 'public/template',
});

fastify.get('/', (req, res) => {
  res.view('index.pug', {
    name: 'Amin',
    user: req.session.user,
    auth: req.session.auth
  });
});

fastify.post('/resid', (req, res) => {
  if (!req.session.auth) {
    res.redirect('/login');
    return;
  }

  resid.bimeh(req, res);
});

fastify.get('/resid', (req, res) => {
  if (!req.session.auth) {
    res.redirect('/login');
    return;
  }

  res.view('resid.pug', {
    title: 'ثبت اقساط',
    headerTitle: 'ثبت اقساط',
    name: 'Amin',
    user: req.session.user,
    auth: req.session.auth,
    page: 'resid'
  });
});

fastify.get('/list', (req, res) => {
  if (!req.session.auth) {
    res.redirect('/login');
    return;
  }

  list.list().then( data => {
    res.view('list.pug', {
      title: 'لیست اقساط',
      headerTitle: 'ثبت اقساط',
      name: 'Amin',
      user: req.session.user,
      auth: req.session.auth,
      val: data,
      page: 'list'
    });
  });
});

fastify.get('/delete/:id', (req, res) => {
  list.delete(req, res);
});

fastify.post('/user/add', { schema: user.userSchema } , (req, res) => {
  user.add(req, res);
});

fastify.get('/register', (req, res) => {
  user.addFront(req, res);
});

fastify.get('/login', (req, res) => {
  user.loginFront(req, res);
});

fastify.post('/user/login' , (req, res) => {
  user.login(req, res).then( (user) => {
    req.session.auth = true;
    req.session.user = user[7] + ' ' + user[8];
    req.session.uid = user[0];
    res.redirect('/');
  }).catch( () => {
    res.send('نام کاربری یا رمز عبور اشتباه می باشد.');
  });
});

fastify.get('/logout' , (req, res) => {
  if (req.session.auth) {
    req.destroySession( err => {
      if (err) {
        res.status(500);
        res.send('Internal Server Error');
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
});

fastify.listen(3000, '192.168.1.165', (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	// fastify.log.info(`listen: ${address}`);
});
