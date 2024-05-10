import eyeRegular from "../../../images/icons/eye-regular.svg";
import eyeSlashRegular from "../../../images/icons/eye-slash-regular.svg";

const TextInputField = (props) => {
  const handleClick = () => {
    if (props.togglePwdType) {
      props.togglePwdType();
    }
  };
  return (
    <>
      {/* text-field-error-app works! */}

      <div className={`${props.class || "mb-6"}`}>
        {/* <label
          htmlFor={props.id}
          className="block mb-2 font-medium text-gray-900 dark:text-white"
        >
          {props.label}
        </label> */}

        <label
          htmlFor={props.id}
          className={
            (props.semibold_label ? `font-medium ` : "") +
            `block mb-2 font-medium text-gray-900 dark:text-white cursor-pointer`
          }
        >
          {props.label}
        </label>

        {!props.passwordToggler ? (
          <>
            <input
              type={props.type}
              id={props.id}
              name={props.name}
              className={
                (props.placeholder_right ? `placeholder:text-end ` : "") +
                (props.error
                  ? `border bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500
          text-sm rounded-lg block w-full p-2.5 sm:py-4 
          dark:bg-gray-700 
          dark:border-red-500 
          dark:placeholder-gray-400 
          dark:text-red 
          dark:focus:ring-green-500`
                  : `border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`)
              }
              placeholder={props.placeholder}
              autoComplete="off"
              required={props.required ? true : false}
              value={props.value}
              onChange={props.onChange}
            />
            {props.muted_aside_text ? (
              <span className="text-sm text-[#656B76]">
                {props.muted_aside_text}
              </span>
            ) : null}
          </>
        ) : (
          <div className="relative w-full">
            <button
              type="button"
              onClick={handleClick}
              aria-label="toggle password visibility"
              className="w-8 h-full absolute inset-y-0 right-0 flex items-center justify-center pr-3"
            >
              {props.passwordType === "text" ? (
                <img src={eyeRegular} alt="exposed password" />
              )
                : (
                  <img src={eyeSlashRegular} alt="conceal password" />
                )
              }
            </button>

            <input
              // ref={props.password_field_ref}
              type={props.passwordType}
              id={props.id}
              name={props.name}
              className={
                props.error
                  ? `border bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500
          text-sm rounded-lg block w-full p-2.5 sm:py-4 
          dark:bg-gray-700 
          dark:border-red-500 
          dark:placeholder-gray-400 
          dark:text-red 
          dark:focus:ring-green-500`
                  : `border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`
              }
              placeholder={props.placeholder}
              autoComplete="off"
              required={props.required ? true : false}
              value={props.value}
              onChange={props.onChange}
            />
          </div>
        )}

        {props.error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            <span className="font-medium">{props.error}</span>
          </p>
        )}
      </div >
    </>
  );
};

export default TextInputField;
