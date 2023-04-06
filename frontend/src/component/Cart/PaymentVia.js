import React from 'react'
import Payment from './Payment'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const PaymentVia = ({ stripeApiKey }) => {
  return (
    <>
    {stripeApiKey && (<Elements stripe={loadStripe(stripeApiKey)}>
        <Payment />
    </Elements>
    )}
    </>
  )
}

export default PaymentVia