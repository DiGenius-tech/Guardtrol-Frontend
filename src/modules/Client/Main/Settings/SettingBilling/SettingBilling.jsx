import React from "react";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import logo_mastercard from "../../../../../images/logo-mastercard.svg";

const SettingBilling = () => {
  return (
    <>
      {/* setting-billing-app works! */}

      <div className="sm:max-w-4xl grid grid-cols-12 gap-4 sm:gap-8">
        <div className="hidden sm:block col-span-12 sm:col-span-5">
          <h3 className="font-bold">Current plan</h3>
        </div>
        <div className="col-span-12 sm:col-span-7">
          <div class="p-6 bg-dark-400 text-white border border-gray-200 rounded-lg shadow">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <th scope="row" className="text-left py-2 px-2 py-2.5">
                    <p className="font-light">Monthly plan</p>
                    <p></p>
                  </th>
                  <td className="text-right py-2 px-2 py-2.5">
                    <p className="text-2xl font-bold">₦26,000</p>
                    <p className="text-xs font-light">5 of 7 Guards used</p>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="text-left py-2 px-2 py-2.5">
                    <p className="font-light">Next billing date</p>
                    <p></p>
                  </th>
                  <td className="text-right py-2 px-2 py-2.5">
                    <p className="font-normal">24 April, 2024</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="hidden sm:block col-span-12 sm:col-span-5">
          <h3 className="font-bold">Invoices</h3>
        </div>
        <div className="col-span-12 sm:col-span-7">
          <div className="">
            {/* <div class="relative overflow-x-auto"> */}
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3 rounded-s-lg">
                    Date
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Plan
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 rounded-e-lg"
                    aria-label="action"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map(() => {
                  return (
                    <tr class="bg-white dark:bg-gray-800">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        24 Aug, 2023
                      </th>
                      <td class="px-6 py-4">Monthly plan</td>
                      <td class="px-6 py-4">Paid</td>
                      <td class="px-6 py-4">
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
                <tr class="font-semibold text-gray-900 dark:text-white">
                  <th
                    scope="row"
                    colSpan={"4"}
                    class="px-6 py-3 text-sm font-light text-right"
                  >
                    <div className="inline-flex items-center justify-end gap-4">
                      <a
                        href="#"
                        className="inline-flex items-center justify-center border border-gray-300 text-sm rounded-lg block w-full p-1.5 font-semibold min-w-10 min-h-8"
                      >
                        1
                      </a>
                      <div>
                        of&nbsp;<span>4</span>
                      </div>
                      <div className="flex items-center">
                        <a
                          href="#"
                          className="inline-flex items-center justify-center bg-accent-200 text-dark-70 hover:bg-accent-300 hover:text-secondary-500 border border-gray-300 text-sm rounded-s-lg block w-full p-2 min-w-10 min-h-8"
                        >
                          <GrPrevious />
                        </a>
                        <a
                          href="#"
                          className="inline-flex items-center justify-center bg-accent-200 text-dark-70 hover:bg-accent-300 hover:text-secondary-500 border border-gray-300 text-sm rounded-r-lg block w-full p-2 min-w-10 min-h-8"
                        >
                          <GrNext />
                        </a>
                      </div>
                    </div>
                  </th>
                </tr>
              </tfoot>
            </table>
            {/* </div> */}
          </div>
        </div>

        <div className="hidden sm:block col-span-12 sm:col-span-5">
          <h3 className="font-bold">Card details</h3>
        </div>
        <div className="col-span-12 sm:col-span-7">
          <ul className="flex flex-col gap-4">
            <li>
              <div class="p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                Card
              </div>
            </li>
            <li>
              <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <img
                  class="object-cover w-full rounded-t-lg h-auto w-40 m-4"
                  src={logo_mastercard}
                  alt=""
                />
                <div class="default-payment-card | flex flex-col justify-between p-4 leading-normal">
                  <h5 class="title mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                    Mastercard
                  </h5>
                  <p class="mb-3 font-normal text-dark-350">
                    Ending with 2378
                  </p>
                </div>
              </div>
            </li>
          </ul>
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
