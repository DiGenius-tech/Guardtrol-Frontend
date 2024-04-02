import React, { useState } from "react";
import QRGenerator from "./QRGenerator/QRGenerator";
// import QRCode from "react-qr-code";
import PointModal from "./PointModal/PointModal";
import "./ConfigureBeats.scss";
import PatrolRouteSelectionForMobile from "./PatrolRouteSelectionForMobile/PatrolRouteSelectionForMobile";
import TextInputField from "../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";

const ConfigureBeats = () => {
  const [text, setText] = useState("default text for QRCode");
  const [saveBeatData] = useState(false);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  // const saveBeat = () => {
  //     setSaveBeatData(true);
  // }

  return (
    <>
      {/* configure-beats-app works! */}

      <h1 className="font-bold text-center text-2xl text-dark-450">
        Configure Beat
      </h1>
      <p className="text-center mx-auto max-w-[400px] text-dark-400">
        This is just a subtext to support the topic above
      </p>

      {/* Large Screen */}
      <div className="hidden sm:block mx-auto max-w-[500px] my-16">
        <form>
          <div className="mb-6">
            <TextInputField
              label="Name of beat"
              semibold_label={true}
              type="text"
              id="name-of-beat"
              required="required"
            />
          </div>

          <div className="shadow-md border-gray-300 text-sm rounded-2xl  block w-full p-4 sm:p-12 ">
            <input
              type="hidden"
              value={text}
              onChange={handleChange}
              placeholder="Enter text for QR code"
            />

            {!saveBeatData ? (
              <div className="flex flex-col">
                {/* QR Generator */}
                <div className="inline-flex mx-auto mb-8">
                  <QRGenerator text={text} qr_code_size={210} />
                </div>
                <p className="text-center font-semibold text-xl text-dark-400">
                  Scan this QR Code with your mobile device to configure the
                  patrol route
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Success message: toogle the "hidden" class on the container to hide or show the message*/}
                <div className="inline-flex mx-auto">
                  <QRGenerator text={text} qr_code_size={130} />
                </div>
                <div className="relative overflow-x-auto mt-4 text-md">
                  {" "}
                  {/**container */}
                  <table className="w-full text-left rtl:text-left dark:text-gray-400">
                    <thead className="dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 rounded-s-lg text-center text-base font-semibold"
                          colSpan={2}
                        >
                          🎉Routes successfully configured
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Name of Beat
                        </th>
                        <td className="px-6 py-2 text-right">First Floor</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Number of Patrol points
                        </th>
                        <td className="px-6 py-2 text-right">6 points</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold text-gray-900 dark:text-white">
                        <th scope="row" className="px-6 py-3" colSpan={3}>
                          {/* PointModal */}
                          <PointModal />
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="my-8"></div>
          <RegularButton text="Continue To Onboard Guards" />
        </form>
      </div>

      {/* Mobile */}
      <div className="block sm:hidden mx-auto max-w-[500px] my-16">
        <form>
          <div className="mb-6">
            <label
              htmlFor="name-of-beat"
              className="block mb-2 font-semibold dark:text-white"
            >
              Name of beat
            </label>
            <input
              type="text"
              id="name-of-beat"
              className="border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              required
            />
          </div>

          {/* Patrol route selection for mobile */}
          <PatrolRouteSelectionForMobile />

          <p className="horizontal-line-title fw-medium my-4 text-center">
            Or you can
          </p>

          {/*  */}

          <div className="shadow-md border-gray-300 text-sm rounded-md sm:rounded-2xl  block w-full p-4 sm:p-12 ">
            <input
              type="hidden"
              id="qr-code-texts"
              value={text}
              onChange={handleChange}
              placeholder="Enter text for QR code"
            />

            {!saveBeatData ? (
              <div className="flex items-center gap-4">
                {/* QR Generator */}
                <div className="inline-flex">
                  <QRGenerator text={text} qr_code_size={80} />
                </div>
                <p className="font-medium text-dark-400">
                  Scan this QR Code with your mobile device to configure the
                  patrol route
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Success message: toogle the "hidden" class on the container to hide or show the message*/}
                <div className="inline-flex mx-auto">
                  <QRGenerator text={text} qr_code_size={110} />
                </div>
                <div className="relative overflow-x-auto mt-4 text-md">
                  {" "}
                  {/**container */}
                  <table className="w-full text-left rtl:text-left dark:text-gray-400">
                    <thead className="dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 rounded-s-lg text-center text-base font-semibold"
                          colSpan={2}
                        >
                          🎉Routes successfully configured
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Name of Beat
                        </th>
                        <td className="px-6 py-2 text-right">First Floor</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <th
                          scope="row"
                          className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          Number of Patrol points
                        </th>
                        <td className="px-6 py-2 text-right">6 points</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold text-gray-900 dark:text-white">
                        <th scope="row" className="px-6 py-3" colSpan={3}>
                          {/* PointModal */}
                          <PointModal />
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="my-8"></div>
          <RegularButton text="Continue To Onboard Guards" />
        </form>
      </div>
    </>
  );
};

export default ConfigureBeats;
