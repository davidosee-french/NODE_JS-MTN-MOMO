import axios from 'axios'
import { v4 as uuid } from 'uuid'


// EXTERNAL API REQUESTS 

// Send RequesttoPay to MTN MOMO
const sendRequestTopay = (transaction_data, request_id) =>{

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.BASE_URL}/requesttopay`,
    headers: { 
      'X-Reference-Id': request_id, 
      'X-Target-Environment': process.env.MOMO_ENV, 
      'Ocp-Apim-Subscription-Key': process.env.COLLECTIONS_PRIMARY_KEY,  
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${process.env.COLLECTIONS_TOKEN}`
    },
    data : transaction_data // body corps {amount : }
  }
  return axios.request(config)
} 

// Send Payment status request to MTN MOMO
const sendPaymentStatusRequest = (request_id) =>{

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.BASE_URL}/requesttopay/${request_id}`,
    headers: { 
      'X-Target-Environment': process.env.MOMO_ENV, 
      'Ocp-Apim-Subscription-Key': process.env.COLLECTIONS_PRIMARY_KEY, 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${process.env.COLLECTIONS_TOKEN}`
    }
  }
  return axios.request(config)
}





// @desc Return Payment Status 
// @route POST  : /api/payment-handler
const RequestPayment = async (req, res, next) => 
{

  // Send 400 - Bad request if the body is not provided 
  if (!req.body || Object.keys(req.body).length === 0)
  {
    const err = new Error ('Request body is required')
    err.status = 400
    next(err)
  }
  else 
  {
    // Grabbing Form data 
    const { number, cost } = req.body

    // Generate a unique request_id
    const request_id = uuid()
    console.log(request_id)

    // Send the requestTopay MTN MOMO request
    await sendRequestTopay(
      {
        "amount": cost,
        "currency": "EUR",
        "externalId": "00004335",
        "payer": {
          "partyIdType": "MSISDN",
          "partyId": number
        },
        "payerMessage": "MoMo Market Payment",
        "payeeNote": "MoMo Market Payment"
      },
      request_id
    ).then(async (response)=>{
      
      // Confirm requestTopay sent to the payer 
      if (response.status == 202) // Accepted 
      {
        // Get Payment status from MOMO API 
        await sendPaymentStatusRequest(request_id)
        .then((response)=>{

          // RETURNNING THE PAYMENT STATUS TO THE CLIENT 
          res.status(200).send(response.data)

        })
        .catch(err=>{ // paymentStatus error 
          // Send Error to the ErrorHandler middleware
          next(err)
        })

      }
      else // requestTopay could not be sent to the payer 
        res.status(500).json({ msg : "Request to pay could not be sent"})

    })
    .catch(err=>{ // requesttopay error

      console.log(err)
      // If StatusCode = 401 => Token has expired
      if (err.response.status == 401)
        res.json({ Error : "Token expired"})
      //console.log(err.response);
      // Send Error to the ErrorHandler middleware
      next(err)
    })
  }
}


export {RequestPayment}


