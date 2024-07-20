import React, { useState } from "react";

function MultiSelectField(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionToggle = (option) => {
    console.log(
      props.selectedOptions.find((opt) => opt.value === option.value)
    );

    if (props.selectedOptions.find((opt) => opt._id === option._id)) {
      props.setSelectedOptions(
        props.selectedOptions.filter((item) => item.value !== option.value)
      );
    } else {
      props.setSelectedOptions([...props.selectedOptions, option]);
    }
  };

  const clearSelectedOptions = () => {
    props.setSelectedOptions([]);
  };

  return (
    <div className="relative">
      <label
        htmlFor={props.id}
        className={
          (props.semibold_label ? `font-semibold ` : "font-medium ") +
          `block mb-2 text-gray-900 dark:text-white cursor-pointer sm:text-lg`
        }
      >
        {props?.label}
      </label>
      <div className="relative" onClick={toggleDropdown}>
        <div className="flex items-center justify-between w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500">
          <div className="flex flex-wrap flex-grow overflow-hidden">
            {props?.selectedOptions &&
              props.selectedOptions.map((option) => (
                <div
                  key={option._id}
                  className="bg-green-500 text-white rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2"
                >
                  <span>{option.name}</span>
                  <button
                    className="ml-1 focus:outline-none"
                    onClick={() => handleOptionToggle(option)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 fill-current"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            {props?.selectedOptions?.length === 0 && (
              <span className="px-2 py-1 text-gray-500">Select Guards...</span>
            )}
          </div>
          <button
            type="button"
            className="p-2 focus:outline-none"
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2.293 3.293a1 1 0 011.414 0L10 9.586l6.293-6.293a1 1 0 111.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414zM10 18a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            {props?.optionList?.map((option) => (
              <label
                key={option._id}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-green-500"
                  value={option}
                  checked={props.selectedOptions.find(
                    (opt) => opt._id === option._id
                  )}
                  onChange={() => handleOptionToggle(option)}
                />
                <span className="ml-2">{option.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiSelectField;
