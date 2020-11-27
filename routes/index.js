var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const dataQuery = require('../db/conectionDB');


router.get('/', function(req, res, next) {
    const datas = dataQuery.resultQuery(`SELECT * from actividad  ;`).then((data) => {
       /*for(var i=0; i<9;i++){
        console.log(data[i])
       };*/
        res.render('index', {
            title: 'Moneda Aunar',
            data: data,
            isAuthenticated: req.oidc.isAuthenticated()
        });
    }).catch((err) => console.log(err));
});

router.get('/profile', requiresAuth(), function(req, res, next) {
    const elementActividades = {}
        // capturar email del Auth0 para usarlo en el query
    console.log(req.oidc.user.email);
    const mail = req.oidc.user.email;
    const dataQ = dataQuery.resultQuery(`SELECT estudiante.puntos_acum ,estudiante.nombre ,estudiante.numidentidad,estudiante.carrera,estudiante.apellido,actividad.desc_actividad ,actividad.puntos_actividad, participacion.fecha_participacion from estudiante inner join participacion on participacion.id_estudiante =estudiante.id_estudiante
    inner join actividad on actividad.id_actividad = participacion.id_actividad WHERE estudiante.email= '${mail}' ;`).then((data) => {
            // const dataQ = dataQuery.resultQuery(`SELECT * from estudiante ;`).then((data) => {
            console.log(data);
            // stringify recibe el data y lo transforma en un json de tipo string
            let datos = JSON.stringify(data, null, 2);

            // convertir de string a json:
            var datos2 = JSON.parse(datos);
            for (const key in datos2) {
                if (datos2.hasOwnProperty(key)) {
                    elementActividades[`Actividad${key}`] = datos2[key].desc_actividad;
                    elementActividades[`Puntos${key}`] = datos2[key].puntos_actividad;

                }
            }
            console.log('const', elementActividades);

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
                numIdentidad: datos2[0].numidentidad,
                carrera: datos2[0].carrera,
                puntos_Acum: datos2[0].puntos_acum,
                actividad: datos2[1].desc_actividad,
                fecha: datos2[0].fecha_participacion,
                puntosActividad: datos2[0].puntos_actividad
            });
        })
        .catch((err) => console.log(err));
});



module.exports = router;