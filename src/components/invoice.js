import React, { useEffect, useRef } from "react";
import brandLogo from "../images/brand-logo.svg";
import { Table } from "flowbite-react";

import { BEAT_PRICE, GUARD_PRICE } from "../constants/static";
import { useReactToPrint } from "react-to-print";

const Invoice = ({ invoice, componentRef }) => {
  const invoiceDate = new Date(invoice?.createdAt);
  const expiryDate = new Date(invoice?.subscription?.expiresat);

  const invoiceItems = [
    {
      item: "Beats",
      quantity: invoice?.subscription?.maxbeats,
      rate: BEAT_PRICE,
    },
    {
      item: "Extra Guards",
      quantity: invoice?.subscription?.maxextraguards,
      rate: GUARD_PRICE,
    },
  ];

  const calculateTotal = () => {
    return invoiceItems.reduce(
      (total, item) => total + item?.quantity * item?.rate,
      0
    );
  };

  const formatDate = (date) => {
    const fdate = new Date(date);
    return fdate?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formatCurrency = (amount) => {
    return `₦${amount?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };
  return (
    <>
      <div ref={componentRef} className="  bg-gray-50 px-10 py-5">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="grid grid-cols-2 my-2 ">
                  <div className="">
                    <img
                      width={200}
                      src={brandLogo}
                      alt="Company Logo"
                      className="img-fluid"
                    />
                  </div>
                  <div className=" text-right text-sm ">
                    <h6 className="font-bold text-lg">Alphatrol Limited</h6>
                    <p className="text-sm text-dark-700 ">
                      167 Adetokunbo Ademola Crescent
                      <br />
                      Wuse, Abuja, Nigeria
                    </p>
                    <p className="text-sm">+234 704-1111-161</p>
                    <p>info@alphatrol.com</p>
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-2 w-full my-5">
                  <div className="grid grid-cols-1">
                    <h6 className="font-semibold">Bill To:</h6>
                    <p>{invoice?.user?.name}</p>
                    <p> {invoice?.user?.email}</p>
                  </div>
                  <div className="grid grid-cols-1 text-right leading-3 gap-x-0">
                    <h6 className="font-bold text-lg">Invoice </h6>
                    <p> {invoice?.invoiceNumber || invoice?._id}</p>
                    <p> {formatDate(invoice?.createdAt)}</p>
                    <div> </div>
                  </div>
                </div>
                <hr />

                <h6 className="mt-5 text-xl font-semi-bold">Order Details</h6>
                <p className="my-2">
                  Invoice for subscription from{" "}
                  {invoice?.subscription?.startsAt
                    ? formatDate(invoice?.subscription?.startsAt)
                    : "Your subscription end date"}
                  {" to "}
                  {formatDate(invoice?.subscription?.expiresat)}
                </p>
                <Table striped className="">
                  <Table.Head>
                    <Table.HeadCell>Item</Table.HeadCell>
                    <Table.HeadCell>Quantity</Table.HeadCell>
                    <Table.HeadCell>Rate</Table.HeadCell>
                    <Table.HeadCell>Amount</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {invoiceItems
                      ?.filter((item) => item?.quantity !== 0)
                      .map((item, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>{item?.item}</Table.Cell>
                          <Table.Cell>{item?.quantity}</Table.Cell>
                          <Table.Cell>{formatCurrency(item.rate)}</Table.Cell>
                          <Table.Cell>
                            {formatCurrency(item?.quantity * item?.rate)}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table>
                <div className="grid grid-cols-1 bg-[#008080] text-white p-5">
                  <div className="grid grid-cols-2">
                    <h6>Total</h6>
                    <h4 className="font-bold text-xl text-center ml-36">
                      {formatCurrency(calculateTotal())}
                    </h4>
                  </div>
                </div>
                <hr className="my-5" />
                <h6 className=" text-xl font-semi-bold">Payment Information</h6>
                <Table striped className="">
                  <Table.Head>
                    <Table.HeadCell>Method</Table.HeadCell>
                    <Table.HeadCell>Amount Paid</Table.HeadCell>
                    <Table.HeadCell>Transaction Ref</Table.HeadCell>
                    <Table.HeadCell>Transaction ID</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Paystack</Table.Cell>
                      <Table.Cell>
                        {formatCurrency(calculateTotal())}
                      </Table.Cell>
                      <Table.Cell>{invoice?.trxref}</Table.Cell>
                      <Table.Cell> {invoice?.transactionid} </Table.Cell>
                      <Table.Cell> Paid </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                {/* <hr className="my-5" />
                <h6 className=" text-xl font-semi-bold">
                  invoice?.Subscription Details
                </h6>
                <Table striped className="">
                  <Table.Head>
                    <Table.HeadCell>Beats</Table.HeadCell>
                    <Table.HeadCell>Extraguards</Table.HeadCell>
                    <Table.HeadCell>Total</Table.HeadCell>
                    <Table.HeadCell>Activation date</Table.HeadCell>
                    <Table.HeadCell>Expirydate date</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>10</Table.Cell>
                      <Table.Cell>3</Table.Cell>
                      <Table.Cell>
                        {formatCurrency(calculateTotal())}
                      </Table.Cell>
                      <Table.Cell>{formatDate(invoiceDate)}</Table.Cell>
                      <Table.Cell>{formatDate(expiryDate)}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                <hr className="my-5" /> */}

                {/* Company Address and Contact Section */}
                <div className="text-right pt-2 "></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
