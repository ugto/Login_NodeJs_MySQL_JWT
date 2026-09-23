const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require ('util')
const { error } = require('console')

//Promesas para Registrar usuario


exports.register = async(req, res)=>{
    try {
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        //console.log(name + "-" + email + "-" + password)
        let passHash = await bcryptjs.hash(password,8)
        //console.log(passHash)
        conexion.query('INSERT INTO users SET ?',{email:email, name:name, password:passHash},(error, results)=>{
            if(error){console(error)}
            res.redirect('/')
        })
    } catch (error) {
        console.log(error)
    }
}

exports.login = async(req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password
        //console.log(email + "-" + password)

        if(!email || !password){
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un email y password",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM users WHERE email = ?', [email], async(error,results)=>{
                if(results.length == 0 || ! (await bcryptjs.compare(password,results[0].password)) ){
                    res.render('login',{
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectos",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                }else{
                    //Login Correcto
                    const id = results[0].id
                    const token = jwt.sign({id:id},process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //Tocken sin fecha de expiracion
                    //const token = jwt.sign({id:id},process.env.JWT_SECRETO)
                    console.log("TOKEN: " + token + "Para el usuaio: " + email)
                    
                    //Cookies
                    const cookiesOptions={
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt',token,cookiesOptions)
                    res.render('login',{
                        alert:true,
                        alertTitle: "Conexion exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

