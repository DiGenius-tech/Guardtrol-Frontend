import { Link } from "react-router-dom";
import Guard from "./Guard/Guard";

const Status = {
  Success: 1,
  Pending: 0
};

const guardList = [
  {
    id: 1,
    name: "Adewale Quadri",
    phone_number: "0803892890",
    status: 0
  },
  {
    id: 2,
    name: "Abisola Josiah",
    phone_number: "0807800822",
    status: 1
  },
  {
    id: 3,
    name: "John Doe",
    phone_number: "08023273455",
    // status: 1
  }
];

function GuardList() {
  return (
    <>
      {/* guard-list-app works! */}
      <div className="max-w-md mx-auto block mb-20 sm:mb-16">
        <ul className="mb-4 flex flex-col gap-4">
          {guardList.map((guard) => (
            <li key={guard.id}>
              <Guard guard={guard} Status={Status} />
            </li>
          ))}
        </ul>
        <Link
          to="add-guard" className="text-primary-500 font-semibold text-sm">
          + Onboard Another Guard
        </Link>
        
        <div className="my-8"></div>
        <Link
          to=""
          className="block w-full text-white bg-primary-500 hover:bg-primary-600 focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 sm:py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Continue To Assign Beats
        </Link>
      </div>
    </>
  );
}

export default GuardList;
