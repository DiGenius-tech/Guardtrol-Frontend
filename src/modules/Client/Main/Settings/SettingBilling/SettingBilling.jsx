import React, { useEffect, useState } from "react";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import logo_mastercard from "../../../../../images/logo-mastercard.svg";
import logo_visa from "../../../../../images/logo-visa.svg";
import { FaRegTrashAlt } from "react-icons/fa";

const savedPaymentCards = [
  {
    id: "1",
    title: "Mastercard",
    default: true,
    lastFourDigits: 2378,
    brandLogo: logo_mastercard
  },
  {
    id: "2",
    title: "VISA",
    default: false,
    lastFourDigits: 1334,
    brandLogo: logo_visa
  }
]

const SettingBilling = () => {
  const [defaultCard, setDefaultCard] = useState({
    id: ""
  });

  const [isAddNewCard, setIsAddNewCard] = useState(false);

  const handleDefaultCard = (e) => {
    console.log("e.target.value: ", e.target.value)
    setDefaultCard(e.target.value);
  }

  useEffect(() => {
    console.log("defaultCard: ", defaultCard)
    return () => {

    };
  }, [defaultCard]);
  return (
    <>
      {/* setting-billing-app works! */}

      <div className="sm:max-w-4xl grid grid-cols-12 gap-4 sm:gap-8">
        <div className="hidden sm:block col-span-12 sm:col-span-5">
          <h3 className="font-bold">Current plan</h3>
        </div>
        <div className="col-span-12 sm:col-span-7">
          <div className="p-4 sm:p-6 bg-dark-400 text-white border border-gray-200 rounded-lg shadow">
            <ul className="flex flex-col gap-4">
              <li className="grid grid-cols-2 items-center">
                <div className="col-span-2 sm:col-span-1 font-light">Monthly plan</div>
                <div className="col-span-2 sm:col-span-1 sm:text-right">
                  <p className="text-2xl font-bold">₦26,000</p>
                  <p className="text-xs font-light">5 of 7 Guards used</p>
                </div>
              </li>
              <li className="grid grid-cols-2 items-center">
                <div className="col-span-2 sm:col-span-1 font-light">Next billing date</div>
                <div className="col-span-2 sm:col-span-1 sm:text-right">
                  <p className="font-normal">24 April, 2024</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="hidden sm:block col-span-12 sm:col-span-5">
          <h3 className="font-bold">Invoices</h3>
        </div>
        <div className="col-span-12 sm:col-span-7">
          <div className="">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-s-lg">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Plan
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 rounded-e-lg"
                      aria-label="action"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((e, i) => {
                    return (
                      <tr key={i} className="bg-white dark:bg-gray-800">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          24 Aug, 2023
                        </th>
                        <td className="px-6 py-4">Monthly plan</td>
                        <td className="px-6 py-4">Paid</td>
                        <td className="px-6 py-4">
                          <a
                            href=""
                            className="font-semibold text-primary-500 whitespace-nowrap"
                          >
                            Get Invoice
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="font-semibold text-gray-900 dark:text-white">
                    <th
                      scope="row"
                      colSpan={"4"}
                      className="px-6 py-3 text-sm font-light text-right"
                    >
                      <div className="inline-flex items-center justify-end gap-4">
                        <a
                          href="#"
                          className="inline-flex items-center justify-center border border-gray-300 text-sm rounded-lg w-full p-1.5 font-semibold min-w-10 min-h-8"
                        >
                          1
                        </a>
                        <div>
                          of&nbsp;<span>4</span>
                        </div>
                        <div className="flex items-center">
                          <a
                            href="#"
                            className="inline-flex items-center justify-center bg-accent-200 text-dark-70 hover:bg-accent-300 hover:text-secondary-500 border border-gray-300 text-sm rounded-s-lg w-full p-2 min-w-10 min-h-8"
                          >
                            <GrPrevious />
                          </a>
                          <a
                            href="#"
                            className="inline-flex items-center justify-center bg-accent-200 text-dark-70 hover:bg-accent-300 hover:text-secondary-500 border border-gray-300 text-sm rounded-r-lg w-full p-2 min-w-10 min-h-8"
                          >
                            <GrNext />
                          </a>
                        </div>
                      </div>
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="hidden sm:block col-span-12 sm:col-span-5">
          <h3 className="font-bold">Card details</h3>
        </div>
        <div className="col-span-12 sm:col-span-7">
          <form action="">
            <ul className="flex flex-col gap-4">
              {
                savedPaymentCards.map((card) => {
                  return <li key={card.id}>
                    <div className="p-4 sm:flex items-start gap-4 bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <img
                        className="object-cover rounded-t-lg h-auto w-12 mt-2"
                        src={card.brandLogo}
                        alt={card.title}
                      />
                      <div className={
                        (defaultCard === card.id ? `default-payment-card | ` : ``) +
                        `sm:flex w-full gap-4 justify-between leading-normal`}>
                        <div>
                          <h5 className="title mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                            {card.title}
                          </h5>
                          <p className="mb-3 font-normal text-dark-350">
                            Ending with&nbsp;{card.lastFourDigits}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">

                          {
                            defaultCard !== card.id ? <label htmlFor={card.id} className="cursor-pointer text-sm font-semibold text-primary-500">Make this default
                              <input type="radio" name="defaultCard" id={card.id} value={card.id}
                                onChange={(e) => handleDefaultCard(e)} className="absolute invisible" />
                            </label> : ""
                          }
                          <button aria-label="delete card" className="text-red-500 hover:text-red-600">
                            <FaRegTrashAlt />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                })
              }
            </ul>
          </form>

          <div className="my-4"></div>

          {
            isAddNewCard ? <div className="bg-white p-8 rounded shadow-md">
              <h1 className="text-md font-semibold mb-4">Add Card Details</h1>
              <form>
                <div className="mb-4">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input type="text" id="cardNumber" name="cardNumber" className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-8">
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input type="text" id="expiry" name="expiry" placeholder="MM/YY" className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>
                  <div className="col-span-4">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                    <input type="number" min={`100`} max={`999`} id="cvv" name="cvv" placeholder="123" className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">Card Holder Name</label>
                  <input type="text" id="cardHolder" name="cardHolder" className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div className="flex items-center justify-between">
                  <button type="submit" className="bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600">Add card</button>
                  <button type="button" onClick={() => { setIsAddNewCard(false) }} className="bg-gray-300 text-white py-2 px-4 rounded-md hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            </div> : <button type='submit' onClick={() => { setIsAddNewCard(!isAddNewCard) }} className="text-sm font-semibold text-primary-500">+&nbsp;Add Another Card</button>

          }

        </div>
      </div>
      {/* <div className="my-4"></div>
                <div className="text-right">
                    <RegularButton text="Save Changes" width="auto" padding="px-4 py-2" textSize="text-sm" />
                </div> */}
    </>
  );
};

export default SettingBilling;
