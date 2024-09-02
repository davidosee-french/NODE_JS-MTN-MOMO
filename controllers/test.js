import axios from 'axios'
import { response } from 'express';
import { v4 as uuid } from 'uuid'


// = = = = = = = = = = = 
// REQUETES MTN MOMO
// = = = =  = ==  = = = 




// Requete RequesttoPay : sendRequestTopay
const sendRequestTopay = (transaction_data, request_id)=>{

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.BASE_URL}/requesttopay`,
    headers: { 
        'Ocp-Apim-Subscription-Key': process.env.COLLECTIONS_PRIMARY_KEY, 
        'X-Reference-Id': request_id, 
        'X-Target-Environment': process.env.MOMO_ENV, 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${process.env.COLLECTIONS_TOKEN}`
    },
    data : transaction_data
    };

    return axios.request(config)
}

// Status de la requete Requesttopay : sendPaymentStatusRequest
const sendPaymentStatusRequest = (request_id) =>{
    
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.BASE_URL}/requesttopay/${request_id}`,
        headers: { 
            'Ocp-Apim-Subscription-Key': process.env.COLLECTIONS_PRIMARY_KEY, 
            'X-Target-Environment': process.env.MOMO_ENV, 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${process.env.COLLECTIONS_TOKEN}`
        }
        };
    
        return axios.request(config)
}


// ========================================================================


// @desc Return Payment Status 
// @route [POST] : /api/request-payment 
// RequestPayment
const RequestPayment = async (req, res, next) =>{

    // Verifier qu'il y a des information dans le corps de la requete
    if (!req.body || Object.keys(req.body).length == 0)
    {
        const error = new Error("Le corps de la requete est obligatoire")
        error.status = 400 
        next(error)
    }
    else
    {
        // Body data 
        const { numero, montant } = req.body

        // Generer a unique uuid
        const request_id = uuid()
        
        // Executer la requestTopay
        await sendRequestTopay (
            {
                "amount": montant,
                "currency": "EUR",
                "externalId": "123456789",
                "payer": {
                  "partyIdType": "MSISDN",
                  "partyId": numero
                },
                "payerMessage": "MoMo Market Payment",
                "payeeNote": "MoMo Market Payment"
            }, request_id
        )
        .then(async (response) =>{

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


        .catch(err =>{

            // Verifier la validite du Token
            if (err.response.status == 401)
                res.json({ Error : "Token expired"})

            console.log(err.response)
        })
    }

    

    

    

    // Confirmer si la requete a ete envoyee 

    // Verifier le status de la requete
       
    // Retourner le status de la requete à l'application CLIENT/FRONTEND 

}

//
export {RequestPayment}



      



