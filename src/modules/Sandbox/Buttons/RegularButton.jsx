import { useContext } from "react";
import { AuthContext } from "../../../shared/Context/AuthContext";

const RegularButton = (props) => {
  const { isloading } = useContext(AuthContext);

  return (
    <button
      type={props.type}
      // className="text-white bg-primary-500 hover:bg-primary-600
      // focus:ring-1 focus:outline-none focus:ring-green-300
      // font-medium rounded-lg text-sm w-full px-5 py-2.5 sm:py-3
      // text-center dark:bg-green-600 dark:hover:bg-green-700
      // dark:focus:ring-green-800"
      className={
        (props.width ? `w-${props.width} ` : `w-full `) +
        (props.rounded ? `rounded-${props.rounded} ` : `rounded-lg `) +
        (props.textSize ? `text-${props.textSize} ` : `text-base sm:text-lg `) +
        (props.padding ? `${props.padding} ` : `px-5 py-2.5 sm:py-3 `) +
        (props.backgroundColor ? `bg-${props.backgroundColor} ` : `bg-primary-500 hover:bg-primary-600 text-white `) +
        `focus:ring-1 focus:outline-none focus:ring-green-300
      font-medium text-center dark:bg-green-600 dark:hover:bg-green-700
      dark:focus:ring-green-800`}
      disabled={isloading}

      onClick={props.onClick||null}
    >
        {isloading ? "Please Wait" : props.text}
    </button>
  );
};

export default RegularButton;



{/* <button
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
</button> */}
