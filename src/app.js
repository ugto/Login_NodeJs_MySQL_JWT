const express =require ('express')
const path = require('path')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const app = express()


//Cinfijurar el motor de plantilas EJS
app.set('view engine','ejs')

//Configurar carpeta de Views
app.set('views', path.join(__dirname, 'views'))


//Configurar carpeta public
app.use(express.static(path.join(__dirname, 'public')))


//Configuracion de para recibir datos desde Formularios 
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//Configurar las variables de entorno
dotenv.config({path:'./src/env/.env'})

//Configurar para trabajar con cookies
 app.use(cookieParser())

//Rutas
app.use('/',require('./routes/router'))

//Configurar servidor
app.listen(3000,()=>{
    console.log('Servidor Activo en puerto', 3000)
})