import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import { toast } from "react-toastify";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import { AuthContext } from "../../../../../shared/Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Shop = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate()
    const [validationErrors, setValidationErrors] = useState({});
    const { isLoading, error, responseData, sendRequest } = useHttpRequest();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [planFormData, setPlanFormData] = useState({
        numberofbeats: 1,
        extraguards: 0,
    });

    useEffect(() => {
        const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'))

        if (selectedPlan && selectedPlan.amount) {

            setSelectedPlan(selectedPlan)
            setPlanFormData({
                'numberofbeats': parseInt(selectedPlan.numberofbeats),
                'extraguards': parseInt(selectedPlan.extraguards)
            })
        }

        auth.loading(false)

    }, [auth.loading, setSelectedPlan, setPlanFormData])
    const handleChange = (e) => {
        setPlanFormData({ ...planFormData, [e.target.name]: e.target.value });
        setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const newErrors = {};

        // Check each input field's validity and set errors accordingly
        for (const el of form.elements) {
            if (el.nodeName === "INPUT" && !el.validity.valid) {
                console.log(el.name);
                newErrors[el.name] = el.validationMessage;
            }

            if (
                el.name === "numberofbeats" &&
                el.value < 1
            ) {
                newErrors["numberofbeats"] = "Can't Have Less Than 1 Beat";
            } else if (
                el.name === "numberofbeats" &&
                el.value > 10
            ) {
                newErrors["numberofbeats"] = "Can't Have More Than 10 Beats";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            // If there are validation errors, update state and stop submission
            setValidationErrors(newErrors);
            e.stopPropagation();
        } else {
            // Form is valid, handle submission
            //auth.loading(true);
            // try {
            //   const data = await sendRequest(
            //     "http://localhost:5000/api/users/signup",
            //     "POST",
            //     JSON.stringify(formData),
            //     {
            //       "Content-Type": "application/json"
            //     }
            //   );

            //   if (null != data) {
            //     if (auth.login(data)) {
            //       navigate('../verify-email', { replace: true }) //should be dashboard
            //       window.location.reload();
            //     }
            //     // navigate('../verify-email', {replace: true})
            //     // window.location.reload();

            //   }
            // } catch (err) {
            //   console.log(err);
            // } finally {
            //   auth.loading(false);
            // }
            if (null == selectedPlan) {
                toast.error("Please Select A Plan That Works For You")
                return
            }


            localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
            localStorage.setItem('onBoardingLevel', 0)
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    const membership_card_data = [
        {
            title: `₦${planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000}`,
            body_list: [`₦${planFormData.numberofbeats * 10000} P/M`, `${planFormData.extraguards} Extraguards x ₦2000`],
            footer: "This should just give a summary of the benefits",
            type: "monthly",
            amount: (planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000),
            readable: `₦${(planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000)} per month`,
            numberofbeats: planFormData.numberofbeats,
            extraguards: planFormData.extraguards,
        },
        {
            title: `₦${(planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000) * 12 * 0.8}`,
            body_list: [`₦${planFormData.numberofbeats * 10000 * 12 * .8} P/Y`, `${planFormData.extraguards} Extraguards x ₦20000`],
            footer: "This should just give a summary of the benefits",
            type: "yearly",
            amount: (planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000) * 12 * 0.8,
            readable: `₦${(planFormData.numberofbeats * 10000 + planFormData.extraguards * 2000) * 12 * 0.8} per year`,
            numberofbeats: planFormData.numberofbeats,
            extraguards: planFormData.extraguards,
        }
    ];



    const onSelectPlan = (e) => {
        setSelectedPlan(JSON.parse(e.target.value));
    };

    return (
        <>
            {/* shop-app works! */}


            <h1 className="font-bold text-center text-2xl text-dark-450">
                Membership
            </h1>
            <p className="text-sm text-center mx-auto max-w-[400px] text-dark-400">
                The subscription goes towards getting access to the security software to
                help manage your security personel
            </p>

            <div className="mx-auto max-w-[500px] my-16">
                <form onSubmit={handleSubmit} method="post">
                    <div className="mb-6">
                        <TextInputField
                            label="How many beats?"
                            semibold_label={true}
                            type="text"
                            id="numberofbeats"
                            required="required"
                            muted_aside_text="Maximum of 5 guard per beat"
                            name="numberofbeats"
                            value={planFormData.numberofbeats}
                            onChange={handleChange}
                            error={validationErrors['numberofbeats']}
                        />
                    </div>
                    <div className="mb-6">
                        <TextInputField
                            label="How many extra guard?"
                            placeholder="₦2,000 per guard"
                            semibold_label={true}
                            type="text"
                            id="number-of-extra-guard"
                            required="required"
                            placeholder_right={true}
                            name="extraguards"
                            value={planFormData.extraguards}
                            onChange={handleChange}
                            error={validationErrors['extraguards']}
                        />
                    </div>
                    <div className="mb-6">
                        <fieldset>
                            <legend className="block mb-2 font-semibold dark:text-white">
                                Select a plan that works for you
                            </legend>

                            <ul className="grid grid-cols-2 gap-2">
                                {membership_card_data.map((data) => {
                                    return (
                                        <li className="col-span-1" key={data.type}>
                                            <input
                                                type="radio"
                                                name="plan-option"

                                                id={data.type}
                                                value={JSON.stringify(data)}
                                                onChange={(e) => onSelectPlan(e)}
                                            />
                                            <label htmlFor={data.type}>
                                                <span
                                                    className="plan-option-card | cursor-pointer flex flex-col items-center max-w-sm p-4 sm:p-6 rounded-lg shadow dark:bg-gray-800 dark:hover:bg-gray-700
                                                text-white"
                                                >
                                                    <div className="mb-10 sm:mb-12">
                                                        <h2 className="text-xl sm:text-4xl my-8 sm:my-10 font-semibold">
                                                            {data.title}
                                                        </h2>
                                                        <ul className="text-sm">
                                                            {data.body_list.map((bl, i) => {
                                                                return <li key={i}>{bl}</li>;
                                                            })}
                                                        </ul>
                                                    </div>
                                                    <span className="footer text-[#9BA2A7] text-center text-[9px] sm:text-[13px] font-semibold sm:font-normal">
                                                        {data.footer}
                                                    </span>
                                                </span>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        </fieldset>
                    </div>

                    <RegularButton
                        text={
                            "Continue" + (selectedPlan ? ` (${selectedPlan.readable})` : "")
                        }
                    />
                </form>
            </div>
        </>
    );
}

export default Shop;
