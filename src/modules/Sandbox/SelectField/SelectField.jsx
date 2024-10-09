function SelectField(props) {
  return (
    <>
      {/* select-field-app works! */}

      <div className="mb-6">
        <label
          htmlFor={props?.id}
          className={
            (props.semibold_label ? `font-semibold ` : "font-medium ") +
            `block mb-1  text-gray-900 dark:text-white cursor-pointer sm:text-lg`
          }
        >
          {props?.label}
        </label>
        <select
          required
          defaultValue={props?.defaultValue}
          name={props?.name}
          multiple={props?.multiple}
          size={props?.multiSelect ? props?.multiSelect : 0}
          onChange={(e) => {
            if (e.target.value === "def") {
              return;
            }

            props.onChange(e);
          }}
          id={props?.id}
          style={{ height: "42px" }}
          className={`${
            props.error
              ? `border bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500
          text-sm rounded-lg block w-full  sm:py-2.5 
          dark:bg-gray-700 
          dark:border-red-500 
          dark:placeholder-gray-400 
          dark:text-red 
          dark:focus:ring-green-500`
              : ""
          } cursor-pointer border  border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-green-500 focus:border-green-500 block w-full  sm:py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`}
        >
          {props?.setDefaultVlue ? (
            <option value="def" key={""}>
              {`Select  ${props.name}`}
            </option>
          ) : (
            <option value="def" key={""}>
              {"Select Option"}
            </option>
          )}

          {props?.optionList?.length > 0 &&
            props?.optionList?.map((route, index) => {
              return (
                <option value={route.value} key={index}>
                  {route.name}
                </option>
              );
            })}
        </select>
        {props.error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            <span className="font-medium">{props.error}</span>
          </p>
        )}
      </div>
    </>
  );
}

export default SelectField;
