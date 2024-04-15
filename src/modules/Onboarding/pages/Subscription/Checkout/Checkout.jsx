import React, { useContext, useEffect, useState } from 'react';
import flutterwave_seeklogo from "../../../../../images/flutterwave-seeklogo.svg"
import paystack_seeklogo from "../../../../../images/paystack-seeklogo.svg"
import RegularButton from '../../../../Sandbox/Buttons/RegularButton';
import { useNavigate, useLocation } from "react-router-dom";
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { usePaystackPayment } from 'react-paystack';
import "./Checkout.scss";
import { AuthContext } from '../../../../../shared/Context/AuthContext';
import { formatNumberWithCommas } from '../../../../../shared/functions/random-hex-color';
import { toast } from "react-toastify";
import useHttpRequest from '../../../../../shared/Hooks/HttpRequestHook';
import { SubscriptionContext } from '../../../../../shared/Context/SubscriptionContext';


const PaymentOption = {
    FIRST: "flutterwave",
    SECOND: "paystack"
}

const Checkout = () => {
    const auth = useContext(AuthContext)
    const sub = useContext(SubscriptionContext)
    const { isLoading, error, responseData, sendRequest } = useHttpRequest();
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('flutterwave')
    const navigate = useNavigate()

    useEffect(() => {
        const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'))
    
        if (selectedPlan && selectedPlan.amount) {
          setSelectedPlan(selectedPlan)
          
        }
    
        auth.loading(false)
    
     }, [auth.loading, setSelectedPlan])
    const handleCheck = (e) => {
        setPaymentMethod(e)

    }
    const psConfig = {
        email:auth.user.email,
        amount: parseInt(selectedPlan?.amount) * 100,
        metadata: {
        name: auth.user.name,
        phone:auth.user.phone||null,
        },
        publicKey:process.env.REACT_APP_PAYSTACK_KEY,
    }
    const handlePaystackPayment = usePaystackPayment(psConfig);
    const fwConfig = {
        public_key: process.env.REACT_APP_FLUTTERWAVE_KEY,
        tx_ref: Date.now(),
        amount: parseInt(selectedPlan?.amount),
        currency: 'NGN',
        payment_options: "all",
        payment_plan: selectedPlan?.type,
        customer: {
          email: auth.user.email,
          phone_number: auth.user.phone || null,
          name: auth.user.name,
        },
        meta : { counsumer_id: auth.user.userid, consumer_mac: auth.user.clientid },
        customizations: {
          title: "Guardtrol Lite Subscription",
          description: `${selectedPlan?.type} subscription to guardtrol lite`,
          logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
      };
      const handleFlutterPayment = useFlutterwave(fwConfig);

    const pay = async (e) => {
        e.preventDefault()

        if (paymentMethod === 'flutterwave') {
            payWithFlutterwave()
        }else{
            payWithPaystack()
        }
    }
    const payWithFlutterwave = async () => {
        auth.loading(true)

        handleFlutterPayment({
            callback: (response) => {
            if (response.status === "successful") {
                console.log(response)
                createSubscription(response)
            }
            closePaymentModal()
            //auth.loading(false)
         },
         onClose: () => {
            toast.warn("Payment Window Closed, Payment Cancelled")
            auth.loading(false)
         },})




        // localStorage.setItem('onBoardingLevel', 1) //this should be after a successful payment
        // navigate("/onboarding/configure-beats")
        // window.location.reload()
    }

    const payWithPaystack = async () => {
        auth.loading(true)

        handlePaystackPayment({
            onSuccess: (response) => {
                createSubscription(response)
            },
            onClose: () => {
                toast.warn("Payment Window Closed, Payment Cancelled")
                auth.loading(false)
            }
        })
    }

    

    const createSubscription = async ( response ) => {
        try {
            const reqData = {
                response: response,
                plan: selectedPlan,
                paymentgateway: paymentMethod
            }
            auth.loading(true)
            const data = await sendRequest(
                `http://localhost:5000/api/users/subscribe/${auth.user.userid}`,
                'POST',
                JSON.stringify(reqData),
                {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${auth.token}`,
                }
              )
          
              if(data && data.message === "subscribed"){
                localStorage.removeItem('selectedPlan')
                localStorage.setItem("paymentComplete", true)
                localStorage.setItem("onBoardingLevel", 1)
                sub.setCurrentSubscription(data.subscription)
                navigate("/onboarding/membership/successful")
                window.location.reload()
              }
        } catch (error) {
            
        }
    }
    useEffect(() => {
        if (error) {
          toast.error(error)
        }
      }, [error])
    return (
        <div>
            {/* checkout-app works! */}

            <h1 className="font-bold text-center text-2xl text-dark-450">
                Payment
            </h1>
            <p className="text-sm text-center mx-auto max-w-[400px] text-dark-400">
                The subscription goes towards getting access to the security software to
                help manage your security personel
            </p>
            <div className="mx-auto max-w-[500px] my-16">
                <form method='post' onSubmit={pay}>
                    <fieldset className="flex flex-col gap-4 mb-4">
                        <legend className="mb-4 font-semibold text-xl">Select Payment Method</legend>
                        <ul className='payment-options | flex flex-col gap-4'>
                            <li onClick={() => handleCheck(PaymentOption.FIRST)}>
                                <input type="radio" name="payment_option" id="flutterwave" value={paymentMethod} checked />
                                <label htmlFor="flutterwave" className='cursor-pointer block'>
                                    {/* Flutterwave */}
                                    <div className="max-w-32" aria-label='Flutterwave'>
                                        <img src={flutterwave_seeklogo} alt="flutterwave" />
                                    </div>
                                </label>
                            </li>

                            <li  onClick={() => handleCheck(PaymentOption.SECOND)}>
                                <input type="radio" name="payment_option" id="paystack" value={paymentMethod} />
                                <label htmlFor="paystack" className='cursor-pointer block'>
                                    {/* Paystack */}
                                    <div className="max-w-32" aria-label='Paystack'>
                                        <img src={paystack_seeklogo} alt="paystack" />
                                    </div>
                                </label>
                            </li>
                        </ul>
                    </fieldset>

                    <RegularButton text={`Pay ₦${selectedPlan?formatNumberWithCommas(selectedPlan.amount):0} Now`} backgroundColor="#FB9129" 
                    />
                </form>
            </div>
        </div>
    );
}

export default Checkout;
