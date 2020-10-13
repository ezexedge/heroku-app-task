const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');
const sgMail = require("@sendgrid/mail")
const nodemailer = require('nodemailer');

const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');

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


exports.crearCuenta = async (req, res) => {
    // leer los datos
    const { email, password} = req.body;



    const usuario = await Usuarios.findOne({where: { email: req.body.email} })

    console.log('usuario  ...',usuario)

    // si no existe el usuario
    if(usuario) {
        req.flash('error', 'El usuario esta registrado o tu email es incorrecto');
        res.redirect('/crear-cuenta');
        
    }



    const activo = 1

    const usuarioNuevo = await Usuarios.create({email,password,activo})
    await usuarioNuevo.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
              
       
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