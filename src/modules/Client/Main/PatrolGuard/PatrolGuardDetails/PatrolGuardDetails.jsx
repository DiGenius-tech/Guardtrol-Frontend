import { Button, Card, Tabs } from "flowbite-react";
import React, { useState } from "react";
import EditPersonalInformation from "../EditGuard/EditPersonalInformation/EditPersonalInformation";
import EditIdentification from "../EditGuard/EditIdentification/EditIdentification";
import BankDetails from "../EditGuard/BankDetails/BankDetails";
import EditNextOfKin from "../EditGuard/EditNextOfKin/EditNextOfKin";
import EditGuarantorForm from "../EditGuard/EditGuarantorForm/EditGuarantorForm";

const PatrolGuardDetails = () => {
  const [isComment, setIsComment] = useState(false);

  return (
    <>
      {/* patrol-guard-details-app works! */}
      <div className="grid grid-cols-12 gap-4 items-stretch">
        <div className="col-span-12 sm:col-span-4">
          <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="h-20 w-20 rounded-full overflow-hidden">
              <img
                src="data:image/jpeg;base64,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"
                alt=""
              />
            </div>
            <h5 className="text-md font-bold text-gray-900 dark:text-white">
              Doe John
            </h5>
            <ul className="font-normal text-sm text-gray-700 dark:text-gray-400">
              <li>08034644344</li>
              <li>doe_john@yahoo.com</li>
            </ul>
            <div className="my-8"></div>
            <form action="">
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" name="verification" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                <span className="ms-3 text-sm font-semibold text-gray-900 dark:text-gray-300">
                  Verify
                </span>
              </label>
            </form>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-8">
          <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            {!isComment ? (
              <>
                <h5 className="text-md font-bold text-gray-900 dark:text-white">
                  Comment
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Autem, voluptas error! Earum tenetur id tempore reiciendis
                  minus sunt molestias in repellat eveniet, sit nam sint alias
                  accusamus maxime culpa, illum corrupti natus repellendus,
                  iusto fugiat dignissimos ad consectetur aspernatur error!
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Here are the biggest enterprise technology acquisitions of
                  2021 so far, in reverse chronological order.
                </p>
                <div className="my-2"></div>
                <small className="text-dark-250 font-semibold">
                  - Moyo (HR), 09:00am 20/03/2024
                </small>
                <div className="my-4"></div>
                <button
                  onClick={()=>setIsComment(true)}
                  className="text-secondary-500 font-semibold"
                >
                  Edit comment
                </button>
              </>
            ) : (
              <>
                {/* comment form */}
                <form>
                  <div className="mb-5">
                    <label
                      for="message"
                      className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
                    >
                      Your comment
                    </label>
                    <textarea
                      id="message"
                      rows="6"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Leave a comment..."
                    ></textarea>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="text-white bg-primary-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                      Submit
                    </button>
                    <button
                    onClick={()=>setIsComment(false)}
                      type="button"
                      className="text-white bg-gray-300 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="my-4"></div>
      <div className="tab flex-tabs flex-tab-nowrap">
        <Tabs aria-label="Tabs with underline" style="fullWidth">
          <Tabs.Item active title="Personal information">
            <EditPersonalInformation />
          </Tabs.Item>
          <Tabs.Item title="Identification">
            <EditIdentification />
          </Tabs.Item>
          <Tabs.Item title="Next of kin">
            <EditNextOfKin />
          </Tabs.Item>
          <Tabs.Item title="Bank details">
            <BankDetails />
          </Tabs.Item>
          <Tabs.Item title="Guarantor form">
            <EditGuarantorForm />
          </Tabs.Item>
        </Tabs>
      </div>
    </>
  );
};

export default PatrolGuardDetails;
