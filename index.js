const express = require('express')
const path = require('path')
const boom = require('@hapi/boom')
const productsRouter = require('./routes/views/products')
const productsApiRouter = require('./routes/api/products')
const authApiRouter = require('./routes/api/auth')
const passport= require('passport');

//require errors lib
const {
    logErrors,
    wrapErrors, 
    clientErrorHandler,
    errorHandler    
} = require('./utils/middlewares/errorsHandlers')

const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi')

//app as instans's express object
const app = express()

//middelwares
app.use(express.json())

//prefig static and dir public, to manage static files
app.use('/static', express.static(path.join(__dirname, 'public')))

//we don't need app.engine(extention, cb) cause pub is call in a native way
//view engine setup
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'pug')

//initializate passport
app.use(passport.initialize())

//routes
app.use('/products', productsRouter)
//manage the api
app.use('/api/products', productsApiRouter)
app.use('/api/auth', authApiRouter)

//redirect
app.get('/', function(req, res){
    res.redirect('/products')
})

app.use(function(req, res, next) {
    if(isRequestAjaxOrApi(req)) {
        const {
            output: { statusCode, payload }
        } = boom.notFound()

        res.status(statusCode).json(payload)
    }

    res.status(404).render('404')
})

//error handlers
app.use(logErrors)
app.use(wrapErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

const server = app.listen(6006, function(){
    console.log(`Listening http://localhost:${server.address().port}`)
})