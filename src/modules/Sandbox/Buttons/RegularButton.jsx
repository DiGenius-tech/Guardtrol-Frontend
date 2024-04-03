import { useContext } from "react";
import { AuthContext } from "../../../shared/Context/AuthContext";

const RegularButton = (props) => {
  const { isloading } = useContext(AuthContext);

  return (
    <button
      type="submit"
      // className="text-white bg-primary-500 hover:bg-primary-600
      // focus:ring-1 focus:outline-none focus:ring-green-300
      // font-medium rounded-lg text-sm w-full px-5 py-2.5 sm:py-3
      // text-center dark:bg-green-600 dark:hover:bg-green-700
      // dark:focus:ring-green-800"
      className={(props.size==='md' ? 'px-4 py-2 sm:py-2.3 text-xs ' : 'px-5 py-2.5 sm:py-3 text-sm ') + `text-white bg-primary-500 hover:bg-primary-600 
                focus:ring-1 focus:outline-none focus:ring-green-300 
                font-medium rounded-lg w-full
                text-center dark:bg-green-600 dark:hover:bg-green-700 
                dark:focus:ring-green-800`}
      disabled={isloading}
    >
      <span className="text-base sm:text-lg">
        {isloading ? "Please Wait" : props.text}
      </span>
    </button>
  );
};

export default RegularButton;
