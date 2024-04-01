import { useState } from "react";
import { Link } from "react-router-dom";

const TextInputFieldGroup = props => {
  const [isText, setIsText] = useState(false)
  const toggle_input_type = () => {
    setIsText(!isText)
  }
  return (
    <>
      {/* text-field-error-app works! */}

      <div className="mb-6">
        {
          props.link_text ?
            (<div className="flex items-center justify-between mb-2">
              <label
                htmlFor={props.label}
                className="block mb-2 font-medium text-gray-900 dark:text-white"
              >
                {props.label}
              </label>

              {
                !props.link_text.link ? props.link_text.text :
                  <Link
                    to="/auth/forgot-password"
                    className="text-primary-500 font-medium"
                  >
                    {props.link_text.text}
                  </Link>
              }
            </div>) :
            (<label
              htmlFor={props.label}
              className="block mb-2 font-medium text-gray-900 dark:text-white"
            >
              {props.label}
            </label>)
        }
        {/* <input
          type={props.type}
          id={props.id}
          name={props.name}
          className={props.error? 
          (`border bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500
          text-sm rounded-lg block w-full p-2.5 sm:py-4 
          dark:bg-gray-700 
          dark:border-red-500 
          dark:placeholder-gray-400 
          dark:text-red 
          dark:focus:ring-green-500`):(`border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`)}
          placeholder={props.placeholder}
          autoComplete="off"
          required= {props.required ? true: false}
          value={props.value}
          onChange={props.onChange}

        /> */}


        <div className="relative w-full">
          <button type="button" onClick={toggle_input_type} className="w-8 h-full absolute inset-y-0 right-0 flex items-center pr-3">
            {/* type toggler */}
            {
              !isText ? <svg width="576" height="512" viewBox="0 0 576 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M288 144C277.415 144.169 266.908 145.853 256.8 149C261.468 157.237 263.946 166.533 264 176C264 183.354 262.551 190.636 259.737 197.43C256.923 204.225 252.798 210.398 247.598 215.598C242.398 220.798 236.224 224.923 229.43 227.737C222.636 230.552 215.354 232 208 232C198.533 231.946 189.237 229.468 181 224.8C174.515 247.327 175.282 271.323 183.192 293.39C191.102 315.457 205.754 334.476 225.072 347.754C244.391 361.031 267.398 367.895 290.834 367.372C314.269 366.849 336.947 358.966 355.654 344.839C374.361 330.713 388.15 311.059 395.067 288.661C401.984 266.263 401.68 242.256 394.196 220.041C386.713 197.826 372.43 178.528 353.371 164.881C334.311 151.234 311.441 143.928 288 144ZM572.5 241.4C518.3 135.6 410.9 64 288 64C165.1 64 57.6999 135.6 3.49989 241.4C1.21452 245.928 0.0239258 250.928 0.0239258 256C0.0239258 261.072 1.21452 266.072 3.49989 270.6C57.6999 376.4 165.1 448 288 448C410.9 448 518.3 376.4 572.5 270.6C574.785 266.072 575.976 261.072 575.976 256C575.976 250.928 574.785 245.928 572.5 241.4ZM288 400C189.3 400 98.8999 345 50.0999 256C98.8999 167 189.3 112 288 112C386.7 112 477.1 167 525.9 256C477.1 345 386.7 400 288 400Z" fill="#D1D5DB" />
              </svg> : <svg width="640" height="512" viewBox="0 0 640 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_128_60)">
                  <path d="M634 471L36 3.5C34.3589 2.1858 32.4749 1.20793 30.4556 0.62228C28.4364 0.036634 26.3215 -0.1453 24.2319 0.0868786C22.1423 0.319057 20.1189 0.960795 18.2775 1.97541C16.436 2.99002 14.8126 4.35761 13.5 6L3.5 18.5C2.18579 20.1411 1.20792 22.0251 0.622276 24.0444C0.0366302 26.0636 -0.145304 28.1785 0.0868748 30.2681C0.319053 32.3577 0.960791 34.3811 1.9754 36.2225C2.99001 38.064 4.35761 39.6874 6 41L604 508.5C605.641 509.814 607.525 510.792 609.544 511.378C611.564 511.963 613.679 512.145 615.768 511.913C617.858 511.681 619.881 511.039 621.723 510.025C623.564 509.01 625.187 507.642 626.5 506L636.5 493.5C637.814 491.859 638.792 489.975 639.378 487.956C639.963 485.936 640.145 483.821 639.913 481.732C639.681 479.642 639.039 477.619 638.025 475.777C637.01 473.936 635.642 472.313 634 471ZM296.8 146.5L431.6 251.9C429.4 191.9 380.5 144 320 144C312.201 144.025 304.426 144.863 296.8 146.5ZM343.2 365.6L208.4 260.2C210.7 320.1 259.5 368 320 368C327.799 367.97 335.574 367.132 343.2 365.5V365.6ZM320 112C418.7 112 509.1 167 557.9 256C545.928 277.904 531.135 298.143 513.9 316.2L551.6 345.7C572.611 323.225 590.413 297.952 604.5 270.6C606.785 266.072 607.976 261.072 607.976 256C607.976 250.928 606.785 245.928 604.5 241.4C550.3 135.6 442.9 64 320 64C283.3 64 248.3 71 215.4 82.8L261.8 119.1C280.7 114.8 300.1 112 320 112ZM320 400C221.3 400 130.9 345 82.1 256C94.1028 234.09 108.929 213.851 126.2 195.8L88.5 166.3C67.4879 188.774 49.6859 214.047 35.6 241.4C33.3146 245.928 32.124 250.928 32.124 256C32.124 261.072 33.3146 266.072 35.6 270.6C89.7 376.4 197.1 448 320 448C356.7 448 391.7 440.9 424.6 429.2L378.2 392.9C359.3 397.2 339.9 400 320 400Z" fill="#D1D5DB" />
                </g>
                <defs>
                  <clipPath id="clip0_128_60">
                    <rect width="640" height="512" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            }
          </button>
          <input
            type={isText ? "text" : props.type}
            id={props.id}
            name={props.name}
            className={props.error ?
              (`border bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500
          text-sm rounded-lg block w-full p-2.5 sm:py-4 
          dark:bg-gray-700 
          dark:border-red-500 
          dark:placeholder-gray-400 
          dark:text-red 
          dark:focus:ring-green-500`) : (`border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`)}
            placeholder={props.placeholder}
            autoComplete="off"
            required={props.required ? true : false}
            value={props.value}
            onChange={props.onChange}

          />
        </div>
        {props.error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            <span className="font-medium">{props.error}</span>
          </p>
        )}
      </div>
    </>
  );
}

export default TextInputFieldGroup;
