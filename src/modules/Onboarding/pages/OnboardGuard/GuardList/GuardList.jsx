import { Link, useNavigate } from "react-router-dom";
import Guard from "./Guard/Guard";
import UpdateGuard from "../UpdateGuard/UpdateGuard";
import { useCallback, useContext, useEffect, useState } from "react";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import { AuthContext } from "../../../../../shared/Context/AuthContext";
import { toast } from "react-toastify";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";

const Status = {
  Success: 1,
  Pending: 0
};



function GuardList() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState(null);
  const [guards, setGuards] = useState([])
  const [isGuardsLoaded, setIsGuardsLoaded] = useState(false);

  const handle_edit_guard = (guard) => {
    if (guard) {
      setIsEdit(true);
      setSelectedGuard(guard);
    }
  };
  const cancelEdit = ()=>{
    setIsEdit(false);
  }
  const addGuard = useCallback((guard, index) => {
    
    guards[index] = guard;
    setGuards(guards);
   
  }, [guards, setGuards]);

  useEffect(() => {
    const savedGuards = localStorage.getItem("guards");
    
    if (savedGuards) {
      const parsedGuards = JSON.parse(savedGuards);
      if (!isGuardsLoaded) {
        setIsGuardsLoaded(true);
        parsedGuards.forEach( addGuard);
      }
      
    }

     
  }, [isGuardsLoaded]);

  const saveGuard = async (guards) => {
    if (guards == [] || guards.length < 1) {
      toast.info("Add at Least One Guard To Continue")
      return
    }
    auth.loading(true)
    const data = await sendRequest(
      `http://localhost:5000/api/guard/addguard/${auth.user.userid}`,
      'POST',
      JSON.stringify(guards),
      {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${auth.token}`,
      }
    )

    if(data){
      localStorage.removeItem('guards')
      localStorage.setItem("onBoardingLevel", 3)
      navigate("/onboarding/assign-beats")
      window.location.reload()
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])
  return (
    <>
      {/* guard-list-app works! */}
      <div className="max-w-md mx-auto block mb-20 sm:mb-16">
        {isEdit ? (
          <div className="mb-8">
            <UpdateGuard selectedGuard={selectedGuard} cancelEdit={cancelEdit} setGuards={setGuards} />
          </div>
        ) : (
          <>
            <ul className="mb-4 flex flex-col gap-4">
              {guards.map((guard) => (
                <li key={guard.full_name}>
                  <Guard
                    setGuards={setGuards}
                    guard={guard}
                    status={Status}
                    handle_edit_guard={handle_edit_guard}
                  />
                </li>
              ))}
            </ul>
            <Link
              to="add-guard"
              className="text-primary-500 font-semibold text-sm"
            >
              + Onboard New Guard
            </Link>

            <div className="my-8"></div>
            <RegularButton text="Continue To Assign Beats" onClick={()=> saveGuard(guards)} />
          </>
        )}
      </div>
    </>
  );
}

export default GuardList;
