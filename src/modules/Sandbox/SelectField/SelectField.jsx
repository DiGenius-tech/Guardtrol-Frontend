function SelectField(props) {
  return (
    <>
      {/* select-field-app works! */}

      <label
        htmlFor={props.id}
        className={
          (props.semibold_label ? `font-semibold ` : "font-medium ") +
          `block mb-2  text-gray-900 dark:text-white cursor-pointer sm:text-lg`
        }
      >
        {props.label}
      </label>
      <select
        multiple={props?.multiple}
        size={props?.multiSelect ? props?.multiSelect : 0}
        onChange={(e) => props.handleChangeOption(e)}
        id={props.id}
        className="cursor-pointer border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 sm:py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
      >
        {props.optionList?.map((route) => {
          return (
            <option value={JSON.stringify(route)} key={route.id}>
              {route.title}
            </option>
          );
        })}
      </select>
    </>
  );
}

export default SelectField;
