import React, { useRef } from "react";
import brandLogo from "../images/brand-logo.svg";
import { Table } from "flowbite-react";
import ReactToPrint from "react-to-print";

const Invoice = () => {
  const invoiceDate = new Date("2024-05-11");
  const expiryDate = new Date("2024-06-10");
  const componentRef = useRef();
  const handlePrint = () => {
    window.print();
  };

  const invoiceItems = [
    {
      item: "Beats",
      description: "Music production beats",
      quantity: 10,
      rate: 10000,
    },
    {
      item: "Extra Guards",
      description: "Security guards for event",
      quantity: 5,
      rate: 2000,
    },
  ];

  const calculateTotal = () => {
    return invoiceItems.reduce(
      (total, item) => total + item.quantity * item.rate,
      0
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formatCurrency = (amount) => {
    return `₦${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };
  return (
    <>
      <ReactToPrint
        trigger={() => <button>Print Receipt</button>}
        content={() => componentRef.current}
      />
      <div
        ref={componentRef}
        className=" min-h-screen w-screen bg-gray-50 px-10 py-5"
      >
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
                      167 Adetokunbo Ademola Cres
                      <br /> Wuse, Abuja, Nigeria
                    </p>
                    <p className="text-sm">+234 704-1111-161</p>
                    <p>info@alphatrol.com</p>
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-2 w-full my-5">
                  <div className="grid grid-cols-1">
                    <h6 className="font-semibold">Bill To:</h6>
                    <p>John Doe</p>
                    <p>123 Main Street Cityville, State 12345</p>
                    <p> john.doe@example.com</p>
                  </div>
                  <div className="grid grid-cols-1 text-right leading-3 gap-x-0">
                    <h6 className="font-bold text-lg">Invoice </h6>
                    <p> INV0012345</p>
                    <p> {formatDate(invoiceDate)}</p>
                    <div> </div>
                  </div>
                </div>
                <hr />

                <h6 className="mt-5 text-xl font-semi-bold">Order Details</h6>
                <p className="my-2">
                  Invoice for subcription from {formatDate(invoiceDate)}
                  {" to "}
                  {formatDate(expiryDate)}
                </p>
                <Table striped className="">
                  <Table.Head>
                    <Table.HeadCell>Item</Table.HeadCell>
                    <Table.HeadCell>Quantity</Table.HeadCell>
                    <Table.HeadCell>Rate</Table.HeadCell>
                    <Table.HeadCell>Amount</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {invoiceItems.map((item, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{item.item}</Table.Cell>
                        <Table.Cell>{item.quantity}</Table.Cell>
                        <Table.Cell>{formatCurrency(item.rate)}</Table.Cell>
                        <Table.Cell>
                          {formatCurrency(item.quantity * item.rate)}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
                <div className="grid grid-cols-2 bg-[#008080] text-white p-5">
                  <div className="grid grid-cols-2">
                    <h6>Payment </h6>
                    <p>Complete</p>
                    <h6>Payment Method </h6>
                    <p>Paysack</p>
                  </div>
                  <div className="">
                    <h6>Total</h6>
                    <h4 className="font-bold text-xl">
                      {formatCurrency(calculateTotal())}
                    </h4>
                  </div>
                </div>
                <hr className="my-5" />
                <h6 className=" text-xl font-semi-bold">
                  Payment Information{" "}
                </h6>
                <Table striped className="">
                  <Table.Head>
                    <Table.HeadCell>Method</Table.HeadCell>
                    <Table.HeadCell>Amount Paid</Table.HeadCell>
                    <Table.HeadCell>Transaction ID</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Paystack</Table.Cell>
                      <Table.Cell>
                        {formatCurrency(calculateTotal())}
                      </Table.Cell>
                      <Table.Cell>221QADFD</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                {/* <hr className="my-5" />
                <h6 className=" text-xl font-semi-bold">
                  Subscription Details
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
