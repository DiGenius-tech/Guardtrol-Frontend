import React, { useContext, useEffect, useState } from 'react';
import flutterwave_seeklogo from "../../../../../images/flutterwave-seeklogo.svg"
import paystack_seeklogo from "../../../../../images/paystack-seeklogo.svg"
import RegularButton from '../../../../Sandbox/Buttons/RegularButton';
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.scss";
import { AuthContext } from '../../../../../shared/Context/AuthContext';
import { formatNumberWithCommas } from '../../../../../shared/functions/random-hex-color';

const PaymentOption = {
    FIRST: "flutterwave",
    SECOND: "paystack"
}

const Checkout = () => {
    const auth = useContext(AuthContext)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'))
    
        if (selectedPlan && selectedPlan.amount) {
          setSelectedPlan(selectedPlan)
          
        }
    
        auth.loading(false)
    
     }, [auth.loading, setSelectedPlan])
    const handleCheck = () => {

    }

    const pay = async (e) => {
        e.preventDefault()







        localStorage.setItem('onBoardingLevel', 1) //this should be after a successful payment
        navigate("/onboarding/configure-beats")
    }
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
                        <legend className="mb-4 font-semibold text-xl">Select Methods</legend>
                        <ul className='payment-options | flex flex-col gap-4'>
                            <li>
                                <input onChange={handleCheck} type="radio" name="payment_option" id="flutterwave" value={PaymentOption.FIRST} checked />
                                <label htmlFor="flutterwave" className='cursor-pointer block'>
                                    {/* Flutterwave */}
                                    <div className="max-w-32" aria-label='Flutterwave'>
                                        <img src={flutterwave_seeklogo} alt="flutterwave" />
                                    </div>
                                </label>
                            </li>

                            <li>
                                <input onChange={handleCheck} type="radio" name="payment_option" id="paystack" value={PaymentOption.SECOND} />
                                <label htmlFor="paystack" className='cursor-pointer block'>
                                    {/* Paystack */}
                                    <div className="max-w-32" aria-label='Paystack'>
                                        <img src={paystack_seeklogo} alt="paystack" />
                                    </div>
                                </label>
                            </li>
                        </ul>
                    </fieldset>

                    <RegularButton text={`Pay ₦${selectedPlan?formatNumberWithCommas(selectedPlan.amount):0} Now`} backgroundColor="#FB9129" />
                </form>
            </div>
        </div>
    );
}

export default Checkout;
