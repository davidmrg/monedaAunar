var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');


// connection base de datos:

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});


router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Moneda Aunar',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Perfil'
  });
});


// callback de bdd:

router.get('/db', async (req, res) => {
  try{
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    const results = {'results': (result) ? result.rows : null};
    // res.render('pages/db',results);
    res.send(JSON.stringify(results));
    client.release();
  }catch(err){
    console.error(err);
    res.send('Error: ' + err);
  }
});


module.exports = router;
