import React, { useState } from "react";

const Membership = () => {
    const membership_card_data = [
        {
            title: "₦26K",
            body_list: ["₦20,000 p/m", "3 guards x ₦2000"],
            footer: "This should just give a summary of the benefits",
            type: "per_month",
            readable: "₦20,000 per month"
        },
        {
            title: "₦100K",
            body_list: ["₦100,000 p/y", "3 guards x ₦2000"],
            footer: "This should just give a summary of the benefits",
            type: "per_year",
            readable: "₦100,000 per year"
        },
    ];

    const [selectedPlan, setSelectedPlan] = useState(null);

    const onSelectPlan = (e) => {
        setSelectedPlan(JSON.parse(e.target.value))
    }

    return (
        <>
            {/* membership-app works */}
            <h1 className="font-bold text-center text-2xl text-dark-450">Membership</h1>
            <p className="text-sm text-center mx-auto max-w-[400px] text-dark-400">
                The subscription goes towards getting access to the security software to
                help manage your security personel
            </p>

            <div className="mx-auto max-w-[500px] my-16">
                <form>
                    <div className="mb-6">
                        <label
                            htmlFor="number-of-beats"
                            className="block mb-2 font-semibold dark:text-white"
                        >
                            How many beats?
                        </label>
                        <input
                            type="text"
                            id="number-of-beats"
                            className="border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                            required
                        />
                        <span className="text-sm text-[#656B76]">
                            Maximum of 5 guard per beat
                        </span>
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="number-of-extra-guard"
                            className="block mb-2 font-semibold dark:text-white"
                        >
                            How many extra guard
                        </label>
                        <input
                            type="text"
                            id="number-of-extra-guard"
                            placeholder="₦2,000 per guard"
                            className="placeholder:text-end border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                            required
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
                                            <input type="radio" name="plan-option" id={data.type} value={JSON.stringify(data)} onChange={(e) => onSelectPlan(e)} />
                                            <label htmlFor={data.type}>
                                                <span
                                                    className="plan-option-card | cursor-pointer flex flex-col items-center max-w-sm p-4 sm:p-6 rounded-lg shadow dark:bg-gray-800 dark:hover:bg-gray-700
                                                text-white"
                                                >
                                                    <div className="mb-10 sm:mb-12">
                                                        <h2 className="text-xl sm:text-4xl my-8 sm:my-10 font-semibold ff-primary-inverse">
                                                            {data.title}
                                                        </h2>
                                                        <ul className="text-sm">
                                                            {data.body_list.map((bl, i) => {
                                                                return <li key={i}>{bl}</li>;
                                                            })}
                                                        </ul>
                                                    </div>
                                                    <span
                                                        className="footer text-[#9BA2A7] text-center text-[9px] sm:text-[13px] font-semibold sm:font-normal"
                                                    >
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


                    <button
                        type="submit"
                        className="text-white bg-primary-500 hover:bg-primary-600 focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 sm:py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        <span className="text-base sm:text-lg">Continue
                        {
                            selectedPlan ? ` (${selectedPlan.readable})` : null
                        }
                        </span>
                    </button>
                </form>
            </div>
        </>
    );
};

export default Membership;
