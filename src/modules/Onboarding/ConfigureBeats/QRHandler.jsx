import PointModal from "../PointModal/PointModal";
import QRGenerator from "./QRGenerator";

function QRHandler(props) {
  return (
    <>
      {/* QRHandler-app works! */}

      <div className="shadow-md border-gray-300 text-sm rounded-2xl  block w-full p-4 sm:p-12 ">
        <input
          type="hidden"
          value={props.text}
          onChange={props.handleChange}
          placeholder="Enter text for QR code"
        />

        {!props.saveBeatData ? (
          <div className="flex flex-col">
            {/* QR Generator */}
            <div className="inline-flex mx-auto mb-8">
              <QRGenerator text={props.text} qr_code_size={210} />
            </div>
            <p className="text-center font-semibold text-xl text-dark-400">
              Scan this QR Code with your mobile device to configure the patrol
              route
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Success message: toogle the "hidden" class on the container to hide or show the message*/}
            <div className="inline-flex mx-auto">
              <QRGenerator text={props.text} qr_code_size={130} />
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
                      Number of Patrol Points
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
    </>
  );
}

export default QRHandler;
