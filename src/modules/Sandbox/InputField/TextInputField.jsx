import { Link } from "react-router-dom";

const TextInputField = props => {
  return (
    <>
      {/* text-field-error-app works! */}

      <div className="mb-6">
        {/* <label
          htmlFor={props.id}
          className="block mb-2 font-medium text-gray-900 dark:text-white"
        >
          {props.label}
        </label> */}

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
              htmlFor={props.id}
              className="block mb-2 font-medium text-gray-900 dark:text-white"
            >
              {props.label}
            </label>)
        }
        
        <input
          type={props.type}
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
        {props.error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            <span className="font-medium">{props.error}</span>
          </p>
        )}
      </div>
    </>
  );
}

export default TextInputField;
