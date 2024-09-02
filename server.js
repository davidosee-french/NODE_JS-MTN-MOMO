// Modules
import express from 'express'

// Routes
import router from './routes/app-routes.js'

// Middlewares
import ErrorHandler from './middlewares/ErrorHandler.js'
import NotFound from './middlewares/NotFound.js'


// Variables 
const PORT = process.env.PORT || 6000
const app = express()


//Parsers 
app.use(express.json())
app.use(express.urlencoded({extended:false}))


//Disable browser caching 
app.use((req,res,next)=>{
    res.set('Cache-Control', 'no-store')
    next()
})


//Route inits
app.use('/api', router)

//404
app.use(NotFound)

//Middlewares - Error handler  
app.use(ErrorHandler)


//Start server 
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
