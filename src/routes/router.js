const express = require('express')
const router = express.Router()
const conexion = require('../database/db')
const authController = require('../controllers/authController')

//Rutas para las Vistas 'Views'
router.get('/',(req,res)=>{
    res.render('index')
})

router.get('/login',(req,res)=>{
    res.render('login',{alert:false})
})
router.get('/register',(req,res)=>{
    res.render('register')
})

router.get('/register2',(req,res)=>{
    res.render('register2')
})

//Router para los metodos de controllers s
 router.post('/register', authController.register)
 router.post('/login', authController.login)

module.exports= router

