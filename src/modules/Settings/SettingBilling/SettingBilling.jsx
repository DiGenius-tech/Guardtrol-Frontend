import React, { useEffect, useRef, useState } from "react";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import logo_mastercard from "../../../images/logo-mastercard.svg";
import logo_visa from "../../../images/logo-visa.svg";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../redux/selectors/auth";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetAllMySubscriptionsQuery,
  useGetAllSubscriptionsQuery,
  useGetSubscriptionQuery,
} from "../../../redux/services/subscriptions";
import { useGetGuardsQuery } from "../../../redux/services/guards";
import { formatNumberWithCommas } from "../../../shared/functions/random-hex-color";
import moment from "moment";
import RenewSubscription from "../RenewSubscription";
import { get } from "../../../lib/methods";
import UpdateSubscription from "../UpdateSubscription";
import { useGetInvoicesQuery } from "../../../redux/services/invoice";
import Invoice from "../../../components/invoice";
import { useReactToPrint } from "react-to-print";
import ViewInvoice from "../ViewInvoice";
import { formatCurrency, formatDateTime } from "../../../utils/dateUtils";
import Pagination from "../../../shared/Pagination/Pagination";
import { Spinner } from "flowbite-react";

const SettingBilling = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const paramActionValue = searchParams.get("action");

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const organization = useSelector(selectOrganization);
  console.log(paramActionValue === "action");

  const [isAddNewCard, setIsAddNewCard] = useState(false);
  const [isUpdateSub, setIsUpdateSub] = useState(
    paramActionValue === "update" ? true : false
  );
  const [openRenewalModal, setOpenRenewalModal] = useState(false);
  const [openViewInvoice, setOpenViewInvoice] = useState(false);

  const [invoiceLimit, setInvoiceLimit] = useState(10);
  const [invoicePage, setInvoicePage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [defaultCard, setDefaultCard] = useState({
    id: "",
  });

  const itemsPerPage = 5;

  const {
    data: sub,
    isError,
    refetch,
    isUninitialized,
  } = useGetSubscriptionQuery(organization, {
    skip: organization ? false : true,
  });

  const { data: guards } = useGetGuardsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );
  const { data: subs } = useGetAllSubscriptionsQuery(organization, {
    skip: organization ? false : true,
  });

  const { data: invoicesApiResponse, ...invoicesApiResponseDetails } =
    useGetInvoicesQuery(
      { organization: organization, page: invoicePage, limit: invoiceLimit },
      {
        skip: organization ? false : true,
      }
    );

  const totalPages = subs?.length;

  const { data: mySuscriptions } = useGetAllMySubscriptionsQuery(organization, {
    skip: organization ? false : true,
  });

  const toggleIsUpdateSub = () => {
    setIsUpdateSub(!isUpdateSub);
  };

  const handleDefaultCard = (e) => {
    setDefaultCard(e.target.value);
  };

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleInvoiceClick = async (invoice) => {
    setSelectedInvoice(invoice);
    setOpenViewInvoice(true);
  };

  const getNextBillingDate = (subscriptions) => {
    const mutableSubscriptions = [...subscriptions];
    const sortedSubscriptions = mutableSubscriptions.sort(
      (a, b) => new Date(b?.expiresat) - new Date(a?.expiresat)
    );

    const latestSubscription = sortedSubscriptions?.[0];
    const a = latestSubscription
      ? moment(new Date(latestSubscription.expiresat)).format("DD MMMM, YYYY")
      : null;

    return a;
  };

  return (
    <>
      {(sub || sub === null) && (
        <RenewSubscription
          subscription={sub}
          openModal={openRenewalModal}
          setRenewalModal={setOpenRenewalModal}
        />
      )}
      {selectedInvoice && (
        <ViewInvoice
          openModal={openViewInvoice}
          setViewInvoiceModal={setOpenViewInvoice}
          invoice={selectedInvoice}
        />
      )}
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="sm:max-w-4xl grid  grid-cols-12 gap-4 sm:gap-8">
          <div className="hidden sm:block col-span-12 sm:col-span-3">
            <h3 className="font-bold">Current Plan</h3>
          </div>
          <div className="col-span-12 sm:col-span-9">
            <div className="p-4 sm:p-6 bg-dark-400 text-white border border-gray-200 rounded-lg shadow">
              <ul className="flex flex-col gap-4">
                <li className="grid grid-cols-2 items-center">
                  <div className="col-span-2 sm:col-span-1 font-light capitalize">
                    {sub?.plan} plan
                  </div>
                  <div className="col-span-2 sm:col-span-1 sm:text-right">
                    {sub ? (
                      <p className="text-2xl font-bold">
                        {formatCurrency(sub?.totalamount)}
                      </p>
                    ) : (
                      <p className="text-base font-bold">
                        No Active Subscription
                      </p>
                    )}
                    {sub && (
                      <p className="text-xs font-light">
                        {guards?.length} of{" "}
                        {sub?.maxbeats * 5 + sub?.maxextraguards} Guards used
                      </p>
                    )}
                  </div>
                </li>

                {sub ? (
                  <li className="grid grid-cols-2 items-center">
                    <div className="col-span-2 sm:col-span-1 font-light">
                      Next Billing Date
                    </div>
                    <div className="col-span-2 sm:col-span-1 sm:text-right">
                      <p className="font-normal">
                        {mySuscriptions && getNextBillingDate(mySuscriptions)}
                      </p>
                    </div>
                  </li>
                ) : (
                  <li className="grid grid-cols-2 items-center">
                    <div className="col-span-2 sm:col-span-1 font-light">
                      Last Expiry Date
                    </div>
                    <div className="col-span-2 sm:col-span-1 sm:text-right">
                      <p className="font-normal">
                        {moment(mySuscriptions?.[0].expiresat).format(
                          "DD MMMM, YYYY"
                        )}
                      </p>
                    </div>
                  </li>
                )}

                <li className="grid grid-cols-12 items-end gap-4">
                  <div className="col-span-12">
                    {isUpdateSub ? (
                      ""
                    ) : (
                      <button
                        onClick={() => setOpenRenewalModal(true)}
                        type="button"
                        className="w-full block capitalize text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-1 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Renew Subscription
                      </button>
                    )}

                    <div className="my-4"></div>
                    <button
                      type="button"
                      onClick={toggleIsUpdateSub}
                      className="w-full flex capitalize items-center gap-2 font-light"
                    >
                      Update Current Subscription
                      {isUpdateSub ? (
                        <FaCaretUp size={14} />
                      ) : (
                        <FaCaretDown size={14} />
                      )}
                    </button>
                  </div>
                  {isUpdateSub ? <UpdateSubscription /> : ""}
                </li>
              </ul>
            </div>
          </div>
          <div className="hidden sm:block col-span-12 sm:col-span-3">
            <h3 className="font-bold">Invoices</h3>
          </div>
          <div className="col-span-12 sm:col-span-9   pb-40 md:pb-20  relative">
            <div className="relative overflow-x-auto ">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-s-lg">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3  rounded-e-lg">
                      Action
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 rounded-e-lg"
                      aria-label="action"
                    ></th>
                  </tr>
                </thead>

                <tbody>
                  {invoicesApiResponseDetails.isLoading && (
                    <tr className="bg-white dark:bg-gray-800">
                      <td colSpan={3}>
                        <div className="w-full py-6 flex justify-center items-center">
                          <Spinner
                            aria-label="Loading spinner"
                            color={"success"}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                  {invoicesApiResponse?.invoices === 0 ? (
                    <tr className="bg-white dark:bg-gray-800">
                      <td colSpan={3}>
                        <div className="w-full py-6 flex justify-center items-center">
                          <p>No invoice recorded!</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    invoicesApiResponse?.invoices?.map((invoice, i) => {
                      return (
                        <tr
                          key={invoice?._id}
                          className="bg-white dark:bg-gray-800"
                        >
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {invoice?.amount}
                          </td>
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium capitalize text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {invoice?.status}
                          </td>
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {formatDateTime(invoice?.createdAt)}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              onClick={() => handleInvoiceClick(invoice)}
                              href="#"
                              className=" cursor-pointer font-semibold text-primary-500 whitespace-nowrap"
                            >
                              Get Invoice
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              totalEntries={invoicesApiResponse?.total || 0}
              entriesPerPage={invoiceLimit}
              currentPage={invoicePage}
              onPageChange={(p) => setInvoicePage(p)}
              onEntriesPerPageChange={(l) => setInvoiceLimit(l)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingBilling;
