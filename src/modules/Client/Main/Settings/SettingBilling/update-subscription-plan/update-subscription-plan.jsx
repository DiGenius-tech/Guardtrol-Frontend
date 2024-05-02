import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetAllSubscriptionsQuery, useGetSubscriptionQuery } from '../../../../../../redux/services/subscriptions';
import { selectToken, selectUser } from '../../../../../../redux/selectors/auth';
import { useGetGuardsQuery } from '../../../../../../redux/services/guards';
import { formatNumberWithCommas } from '../../../../../../shared/functions/random-hex-color';
import moment from 'moment';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { MdAddHomeWork } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";

const UpdateSubscriptionPlan = () => {
    const user = useSelector(selectUser);
    const token = useSelector(selectToken);

    const navigate = useNavigate();
    const {
        data: sub,
        isError,

        refetch,
        isUninitialized
    } = useGetSubscriptionQuery();

    const { data: guards } = useGetGuardsQuery();
    const [defaultCard, setDefaultCard] = useState({
        id: ""
    });

    const { data: subs } = useGetAllSubscriptionsQuery();

    const [isAddNewCard, setIsAddNewCard] = useState(false);
    const [isUpdateSub, setIsUpdateSub] = useState(false);

    const toggleIsUpdateSub = () => {
        setIsUpdateSub(!isUpdateSub);
    };

    const handleDefaultCard = (e) => {
        setDefaultCard(e.target.value);
    };

    useEffect(() => {
        return () => { };
    }, [defaultCard]);

    const totalPages = subs?.length;
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const itemsPerPage = 5;

    const filterData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const slicedData = subs?.slice(startIndex, endIndex);
        setFilteredData(slicedData);
    };
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        filterData();
    }, [currentPage, subs]);
    return (
        <>
            {/* update-subscription-plan-app works! */}

            <div className="p-4 sm:p-6 bg-dark-400 text-white border border-gray-200 rounded-lg shadow">
                <ul className="flex flex-col gap-4">
                    <li className="grid grid-cols-2 items-center">
                        <div className="col-span-2 sm:col-span-1 font-light">
                            {sub?.plan} plan
                        </div>
                        <div className="col-span-2 sm:col-span-1 sm:text-right">
                            <p className="text-2xl font-bold">
                                ₦{formatNumberWithCommas(sub?.totalamount)}
                            </p>
                            <p className="text-xs font-light">
                                {guards?.length} of{" "}
                                {sub?.maxbeats * 5 + sub?.maxextraguards} Guards used
                            </p>
                        </div>
                    </li>
                    <li className="grid grid-cols-2 items-center">
                        <div className="col-span-2 sm:col-span-1 font-light">
                            Next billing date
                        </div>
                        <div className="col-span-2 sm:col-span-1 sm:text-right">
                            <p className="font-normal">
                                {moment(sub?.updatedat)
                                    .add(sub?.plan === "monthly" ? 30 : 365, "days")
                                    .format("DD MMMM, YYYY")}
                            </p>
                        </div>
                    </li>
                    <li className="grid grid-cols-12 items-end gap-4">
                        <div className="col-span-12">
                            {isUpdateSub ? (
                                ""
                            ) : (
                                <button
                                    type="button"
                                    className="w-full block text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-1 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Renew current subscription
                                </button>
                            )}

                            <div className="my-4"></div>
                            <button
                                type="button"
                                onClick={toggleIsUpdateSub}
                                className="w-full flex items-center gap-2 font-light"
                            >
                                Update subscription
                                {isUpdateSub ? (
                                    <FaCaretUp size={14} />
                                ) : (
                                    <FaCaretDown size={14} />
                                )}
                            </button>
                        </div>
                        {isUpdateSub ? (
                            <div className="col-span-12 sm:text-right">
                                <form className="bg-white/30 rounded-md p-4">
                                    <fieldset className="update-plan-options">
                                        <legend className="text-center mb-4">
                                            Select Plan*
                                        </legend>
                                        <div className="flex items-center justify-between gap-4 flex-wrap">
                                            <div className="flex items-center mb-4">
                                                <input
                                                    id="monthly"
                                                    type="radio"
                                                    name="plan-option"
                                                    value="monthly"
                                                    className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label
                                                    htmlFor="monthly"
                                                    className="cursor-pointer block ms-2 text-lg font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    #10,000 per month
                                                </label>
                                            </div>

                                            <div className="flex items-center mb-4">
                                                <input
                                                    id="yearly"
                                                    type="radio"
                                                    name="plan-option"
                                                    value="yearly"
                                                    className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label
                                                    htmlFor="yearly"
                                                    className="cursor-pointer block ms-2 text-lg font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    #96,000 per year
                                                </label>
                                            </div>
                                        </div>
                                    </fieldset>

                                    <div className="mb-4">
                                        <label
                                            htmlFor="email-address-icon"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            How many beats?
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                <MdAddHomeWork color="#79716b" />
                                            </div>
                                            <input
                                                type="number"
                                                id="email-address-icon"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label
                                            htmlFor="email-address-icon"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            How many extra guard?
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                                <MdPeople color="#79716b" />
                                            </div>
                                            <input
                                                type="number"
                                                id="email-address-icon"
                                                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        class="w-full block text-white bg-green-700 hover:bg-green-800 focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    >
                                        Continue to pay{" "}
                                        <span className="text-lg font-semibold">#30,000</span>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            ""
                        )}
                    </li>
                </ul>
            </div>
        </>
    );
}

export default UpdateSubscriptionPlan;
