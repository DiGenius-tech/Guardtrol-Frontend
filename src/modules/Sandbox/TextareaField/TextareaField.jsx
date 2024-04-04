function TextareaField(props) {
  return (
    <>
      {/* textarea-field-app works! */}

      <label
        htmlFor={props?.id}
        className={
          (props.semibold_label ? `font-semibold ` : "") +
          `block mb-2 font-medium text-gray-900 dark:text-white cursor-pointer`
        }
      >
        {props?.label}
      </label>
      <textarea
        name="description"
        cols="30"
        rows="4"
        id={props?.id}
        placeholder={props?.placeholder}
        value={props.value}
        onChange={props.onChange}
        className={
          (props.placeholder_right ? `placeholder:text-end ` : "") +
          (props.error
            ? `border bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500
      text-sm rounded-lg block w-full p-2.5 
      dark:bg-gray-700 
      dark:border-red-500 
      dark:placeholder-gray-400 
      dark:text-red 
      dark:focus:ring-green-500`
            : `w-full border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`)
        }
      ></textarea>
    </>
  );
}

export default TextareaField;
