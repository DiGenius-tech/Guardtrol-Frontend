function SelectField(props) {
  return (
    <>
      {/* select-field-app works! */}

      <div className="mb-6">
        <label
          htmlFor={props.id}
          className={
            (props.semibold_label ? `font-semibold ` : "font-medium ") +
            `block mb-1  text-gray-900 dark:text-white cursor-pointer sm:text-lg`
          }
        >
          {props.label}
        </label>
        <select
          required
          defaultValue={JSON.stringify(props?.value)}
          name={props.name}
          multiple={props?.multiple}
          size={props?.multiSelect ? props?.multiSelect : 0}
          onChange={(e) => {
            if (e.target.value === "def") {
              return;
            }
            props.handleChangeOption(e);
          }}
          id={props.id}
          style={{ height: "52px" }}
          className="cursor-pointer border  border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
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

          {props.optionList.length > 0 &&
            props.optionList?.map((route, index) => {
              return (
                <option value={route.value} key={index}>
                  {route.name}
                </option>
              );
            })}
        </select>
      </div>
    </>
  );
}

export default SelectField;
