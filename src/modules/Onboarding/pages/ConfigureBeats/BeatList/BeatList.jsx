import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Beat from "./Beat/Beat";
import EditBeat from "../EditBeat/EditBeat";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import useHttpRequest from "../../../../../shared/Hooks/HttpRequestHook";
import { AuthContext } from "../../../../../shared/Context/AuthContext";
import { toast } from "react-toastify";


function BeatList() {
  const [isEdit, setIsEdit] = useState(false);
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [selectedBeat, setSelectedBeat] = useState(null);
  const [isBeatsLoaded, setIsBeatsLoaded] = useState(false);
  const [beats, setBeats] = useState([])

  const handle_edit_beat = (guard) => {
    if (guard) {
      setIsEdit(true);
      setSelectedBeat(guard);
    }
  };

  const addBeat = useCallback((beat, index) => {
    
    beats[index] = beat;
    setBeats(beats);
    //setBeats((prevBeats) => [...prevBeats, beat]);
   
  }, [beats, setBeats]);

  useEffect(() => {
    const savedBeats = localStorage.getItem("beats");
    
    if (savedBeats) {
      const parsedBeats = JSON.parse(savedBeats);
      if (!isBeatsLoaded) {
        setIsBeatsLoaded(true);
        parsedBeats.forEach( addBeat);
      }
      
    }

     
  }, [isBeatsLoaded]);


  const cancelEdit = ()=>{
    setIsEdit(false);
  }

  const saveBeat = async (beats) => {
    if (beats == [] || beats.lenght < 1) {
      toast.info("Add at Least One Beat To Continue")
      return
    }
    auth.loading(true)
    const data = await sendRequest(
      `http://localhost:5000/api/beat/addbeats/${auth.user.userid}`,
      'POST',
      JSON.stringify(beats),
      {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${auth.token}`,
      }
    )

    if(data){
      localStorage.removeItem('beats')
      localStorage.setItem("onBoardingLevel", 1)
      navigate("/onboarding/onboard-guard")
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])
  return (
    <>
      {/* beat-list-app works! */}
      <div className="max-w-md mx-auto block mb-20 sm:mb-16">
        {isEdit ? (
          <div className="mb-8">
            <EditBeat selectedBeat={selectedBeat} setBeats={setBeats} cancelEdit={cancelEdit} />
          </div>
        ) : (
          <>
            <ul className="mb-4 flex flex-col gap-4">
              {beats.map((guard) => (
                <li key={guard.beat_name}>
                  <Beat guard={guard} setBeats={setBeats} handle_edit_beat={handle_edit_beat} />
                </li>
              ))}
            </ul>
            <Link
              to="add-beat"
              className="text-primary-500 font-semibold text-sm"
            >
              + Add New Beat
            </Link>

            <div className="my-8"></div>
            <RegularButton text="Continue To On-Board Guards" onClick={() => saveBeat(beats)} />
              
            
          </>
        )}
      </div>
    </>
  );
}

export default BeatList;
