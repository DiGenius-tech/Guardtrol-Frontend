import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import SelectField from "../../../../Sandbox/SelectField/SelectField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../../../shared/Context/AuthContext";
import { toast } from "react-toastify";
import MultiSelectField from "../../../../Sandbox/SelectField/MultiSelectField";


  
  function AssignNewBeat() {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const { isLoading, error, responseData, sendRequest } = useHttpRequest();
    const [initialBeatState, setInitialBeatState] = useState([]);
    const [initialGuardState, setInitialGuardState] = useState([]);
    const initialFrequencyState = useState([]);
    const [beat, setBeat] = useState(initialBeatState[0]);
    const [guard, setGuard] = useState([]);
    const [frequency, setFrequency] = useState(initialFrequencyState);
    
    const handleBeatSelection = (e) => {
      
      setBeat(JSON.parse(e.target.value));
      
    };
  
    const handleGuardSelection = (e) => {
      console.log(e.target.value)
      setGuard([...guard, JSON.parse(e.target.value)]);
    };
  
    const handleFrequencySelection = (e) => {
      setFrequency(JSON.parse(e.target.value));
    };

    useEffect(() => {
      auth.loading(true)
      const getBeats = async () => {
        const data = await sendRequest(
          `http://localhost:5000/api/beat/getbeats/${auth.user.userid}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${auth.token}`,
          }
        )
        if(!!data){
          setInitialBeatState(data.beats);
          setInitialGuardState(data.guards)
          console.log(data.beats)
        }else{  
          toast.error("Failed To Fetch Beats")
        }
      }
      auth.token && getBeats();
      //setBeats(guardList);
      
    }, [auth.token, auth.user.userid]);

    const checkIfGuardIsAssigned = (guard) => {
      auth.loading(true);
      let isGuardAssigned = {status: false, message:""};
      
      initialBeatState.forEach((beat) => {
        if (beat.guards.some((assignedGuard) => assignedGuard._id === guard._id)) {
           auth.loading(false);
          const message  = (`${guard.name} has already been assigned to ${beat.name}`);
          isGuardAssigned = {status: true, message: message};
          //throw new Error(`${guard.name} has already been assigned to ${beat.name}`);
        }
      });
      
      auth.loading(false);
      return isGuardAssigned;
    };
    

    const save = async (e) => {
      e.preventDefault()
      if (!beat) {
        toast.info('Select a Beat to Assign Guards')
        return
      }
      if (guard.length<1) {
        toast.info('Select Guards to be Assigned to Beats')
        return
      }
      const check = guard.map((item)=> {
       return checkIfGuardIsAssigned(item)
      })
      const c = check.some((value) => {
       if(value.status){
        toast.warning(value.message)
        return true
       }
       
         
      })

      if(c)return

      console.log(check)

      auth.loading(true)
      const formData = {'beat': beat, 'guards': guard}
      
      
      const data = await sendRequest(
        `http://localhost:5000/api/guard/assignbeat/${auth.user.userid}`,
          "POST",
          JSON.stringify(formData),
          {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${auth.token}`,
          }
      )

      if(data){
        navigate('/onboarding/assign-beats')
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
      {/* assign-new-beat-app works! */}

      <h1 className="font-bold text-center text-2xl text-dark-450">
        Assign Beats
      </h1>
      <p className="text-center mx-auto max-w-[400px] text-dark-400">
        Select A beat And Guards To be Assigned(You Can Select Multiple Guards)
      </p>

      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 my-16">
        <form onSubmit={save}>
          {/*  */}
          <div className="mb-6">
            <SelectField
              value={beat}
              name="beat"
              id="beat"
              label="Select beat"
              semibold_label={true}
              handleChangeOption={handleBeatSelection}
              optionList={initialBeatState}
              multipleSelect={false}
            />
          </div>

          <div className="mb-6">
            <MultiSelectField
            selectedOptions={guard}
            setSelectedOptions={setGuard}
              value={guard}
              name="guard"
              multiple={true}
              multiSelect={
                initialBeatState.length >= 10 ? initialBeatState.length - 5 : initialBeatState.length
              }
              id="guard"
              multipleSelect={true}
              label="Select guard"
              semibold_label={true}
              handleChangeOption={handleGuardSelection}
              optionList={initialGuardState}
            />
          </div>

          {/* <div className="mb-6">
            <SelectField
              value={frequency}
              name="frequency"
              id="frequency"
              label="Select frequency"
              semibold_label={true}
              handleChangeOption={handleFrequencySelection}
              optionList={initialFrequencyState}
            />
          </div> */}

          <RegularButton text="Save Changes" />
        </form>
      </div>
    </>
  );
}

export default AssignNewBeat;
