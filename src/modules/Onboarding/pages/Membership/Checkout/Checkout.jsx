import React from 'react';
import flutterwave_seeklogo from "../../../../../images/flutterwave-seeklogo.svg"
import paystack_seeklogo from "../../../../../images/paystack-seeklogo.svg"
import RegularButton from '../../../../Sandbox/Buttons/RegularButton';
import { Label, Radio } from 'flowbite-react';
import "./Checkout.scss";

const PaymentOption = {
    FIRST: "flutterwave",
    SECOND: "paystack"
}

const Checkout = () => {
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
                <form>
                    <fieldset className="flex flex-col gap-4 mb-4">
                        <legend className="mb-4 font-semibold text-xl">Select Methods</legend>
                        <ul className='payment-options | flex flex-col gap-4'>
                            <li>
                                <input type="radio" name="payment_option" id="flutterwave" value={PaymentOption.FIRST} />
                                <label htmlFor="flutterwave" className='cursor-pointer block'>
                                    {/* Flutterwave */}
                                    <div className="max-w-32" aria-label='Flutterwave'>
                                        <img src={flutterwave_seeklogo} alt="flutterwave" />
                                    </div>
                                </label>
                            </li>
                            
                            <li>
                                <input type="radio" name="payment_option" id="paystack" value={PaymentOption.SECOND} />
                                <label htmlFor="paystack" className='cursor-pointer block'>
                                    {/* Paystack */}
                                    <div className="max-w-32" aria-label='Paystack'>
                                        <img src={paystack_seeklogo} alt="paystack" />
                                    </div>
                                </label>
                            </li>
                        </ul>
                    </fieldset>

                    <RegularButton text="Pay Now" backgroundColor="#FB9129" />
                </form>
            </div>
        </div>
    );
}

export default Checkout;
