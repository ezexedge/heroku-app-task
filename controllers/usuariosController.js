const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');
const sgMail = require("@sendgrid/mail")
const nodemailer = require('nodemailer');

const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
sgMail.setApiKey('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')

exports.formCrearCuenta = (req, res ) => {
    res.render('crearCuenta', {
        nombrePagina : 'Crear Cuenta en Uptask'
    })
}


exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina : 'Iniciar Sesión en UpTask', 
        error
    })
}



exports.crearCuenta = (req, res) => {
    // leer los datos
    const { email, password} = req.body;

    
        // crear el usuario
         Usuarios.create({
            email, 
            password
        });

        // crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // crear el objeto de usuario
        const usuario = {
            email
        }

        const emailData = {
            from: 'no-reply@uptask.com',
            to: usuario.email,
            subject: `Account activation link`,
            html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${confirmarUrl}</p>
                <hr />
               
            `
        };

        sgMail
            .send(emailData)
            .then(sent => {
                 
                 req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
                 res.redirect('/iniciar-sesion');
            })
            .catch(err => {
                // console.log('SIGNUP EMAIL SENT ERROR', err)
                req.flash('error', error.errors.map(error => error.message));
                res.render('crearCuenta', {
                    mensajes: req.flash(),
                    nombrePagina : 'Crear Cuenta en Uptask', 
                    email,
                    password
                })



            });

              
       
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}



// Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}