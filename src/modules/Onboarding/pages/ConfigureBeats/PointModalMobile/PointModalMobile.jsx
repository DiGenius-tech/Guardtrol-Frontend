import React, { useState } from "react";
import icon_cancel_modal_primary from "../../../../../images/icons/icon-cancel-modal-primary.svg";
import { Modal } from "flowbite-react";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";

const PointModalMobile = ({ route, openModal, setOpenModal, modalSize }) => {
  return (
    <>
      {/* point-modal-app works! */}
      <Modal
        data-modal-backdrop="static"
        show={openModal}
        onClose={() => setOpenModal(false)}
        size={modalSize}
      >
        {/* <div className="space-y-6"> */}
        <div className="relative dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="px-4 pt-4 dark:border-gray-600">
            <button
              onClick={() => setOpenModal(false)}
              type="button"
              className="flex text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-7 h-7 ms-auto justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
            >
              <img src={icon_cancel_modal_primary} alt="Close modal" />
              <span className="sr-only">Close modal</span>
            </button>
            <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
              What Point is this?
            </h3>
          </div>

          {/* <!-- Modal body --> */}
          <div className="p-4 sm:p-8">
            <div className="rounded-xl overflow-hidden border border-secondary-500 mb-4">
              <iframe
                title={route.title}
                src={route.mapLink}
                width="100%"
                height="300"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div>
              <TextInputField
                label="Name this point"
                semibold_label={true}
                type="text"
                id="point"
                required="required"
              />
            </div>
          </div>
        </div>
        {/* </div> */}
      </Modal>
    </>
  );
};

export default PointModalMobile;
