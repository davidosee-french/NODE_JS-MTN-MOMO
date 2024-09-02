import express from 'express'

// Controllers  
import {RequestPayment} from '../controllers/test.js'


//:: ROUTES
const router = express.Router()

router
.post('/payment-handler', RequestPayment)

//Export to routes
export default router