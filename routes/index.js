var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const dataQuery = require('../db/conectionDB');


router.get('/', function(req, res, next) {
    const datas = dataQuery.resultQuery(`SELECT * from actividad  ;`).then((data) => {
        console.log(data);
        res.render('index', {
            title: 'Moneda Aunar',
            data: JSON.stringify(data, null, 2),
            isAuthenticated: req.oidc.isAuthenticated()
        });
    }).catch((err) => console.log(err));
});

router.get('/profile', requiresAuth(), function(req, res, next) {
    // capturar email del Auth0 para usarlo en el query
    console.log(req.oidc.user.email);
    const mail = req.oidc.user.email;
    const dataQ = dataQuery.resultQuery(`SELECT * from estudiante WHERE email = '${mail}' ;`).then((data) => {
            // const dataQ = dataQuery.resultQuery(`SELECT * from estudiante ;`).then((data) => {
           
            // stringify recibe el data y lo transforma en un json de tipo string
            let datos = JSON.stringify(data, null, 2)

            // convertir de string a json:
            var datos2 = JSON.parse(datos);
            // console.log('los datos son');
            // console.log(datos2);
            // capturar solo nombre
            // console.log('nombre: ');
            // console.log(datos2[0].nombre);

            res.render('profile', {
                userProfile: JSON.stringify(req.oidc.user, null, 2),
                title: 'Perfil',
                nombre: datos2[0].nombre,
                apellido: datos2[0].apellido,
                numIdentidad: datos2[0].numIdentidad,
                carrera: datos2[0].carrera,
                puntos_Acum: datos2[0].puntos_Acum
            });
            
        })
        .catch((err) => console.log(err));
});



module.exports = router;