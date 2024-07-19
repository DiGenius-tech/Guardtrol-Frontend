import { Spinner } from "flowbite-react";

const RegularButton = (props) => {
  return (
    <button
      type={props.type}
      // className="text-white bg-primary-500 hover:bg-primary-600
      // focus:ring-1 focus:outline-none focus:ring-green-300
      // font-medium rounded-lg text-sm w-full px-5 py-2.5 sm:py-3
      // text-center dark:bg-green-600 dark:hover:bg-green-700
      // dark:focus:ring-green-800"
      style={{ cursor: "pointer" }}
      className={
        (props.width ? `w-${props.width} ` : `w-full `) +
        (props.rounded ? `rounded-${props.rounded} ` : `rounded-lg `) +
        (props.textSize ? `text-${props.textSize} ` : `text-base sm:text-lg `) +
        (props.padding ? `${props.padding} ` : `px-5 py-2.5 sm:py-3 `) +
        (props.backgroundColor || props.disabled
          ? `bg-${props.backgroundColor} `
          : `bg-primary-500 hover:bg-primary-600 text-white `) +
        (props.disabled
          ? `bg-gray-200 text-white `
          : `bg-primary-500 hover:bg-primary-600 text-white `) +
        `focus:ring-1 focus:outline-none focus:ring-green-300
      font-medium text-center dark:bg-green-600 dark:hover:bg-green-700
      dark:focus:ring-green-800`
      }
      disabled={props.disabled || props?.isLoading}
      onClick={props.onClick || null}
    >
      <div className="flex gap-2 justify-center items-center">
        {props?.isLoading ? (
          <>
            Please Wait
            <Spinner color="success" aria-label="Success spinner example" />
          </>
        ) : (
          props.text
        )}{" "}
      </div>
    </button>
  );
};

export default RegularButton;

{
  /* <button
type="submit"
className="text-white 
bg-primary-500 
hover:bg-green-800 
focus:outline-none 
focus:ring-4 
focus:ring-green-300 
font-medium 
rounded-full 
text-sm 
px-8 
py-2.5 
text-center 
dark:bg-green-600 
dark:hover:bg-green-700 
dark:focus:ring-green-800"
>
Save
</button> */
}
