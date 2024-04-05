import { useEffect, useState } from "react";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import TextareaField from "../../../../Sandbox/TextareaField/TextareaField";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function EditBeat(props) {
  const [validationErrors, setValidationErrors] = useState({});
  const [preBeat, setPreBeat] = useState('')
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    beat_name: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  useEffect(() => {
    setFormData({
      beat_name: props.selectedBeat.beat_name,
      description: props.selectedBeat.description
    });
    setPreBeat(props.selectedBeat.beat_name)
  }, []);

  const save = async (e) => {
    e.preventDefault();

    if (formData.beat_name === "" || formData.beat_name.length < 3) {
      setValidationErrors({ ...validationErrors, beat_name: "Use A Valid Beat Name" });
    } else {
      const beats = JSON.parse(localStorage.getItem('beats')) || [];
      const index = beats.findIndex(beat => beat.beat_name === preBeat);

      if (index !== -1) { // Check if the beat is found
        
        beats[index].beat_name = formData.beat_name; 
        beats[index].description = formData.description

        localStorage.setItem('beats', JSON.stringify(beats));
        props.setBeats(beats)
        props.cancelEdit()
      } else {
        toast.error('Beat not found');
      }

      
      
    }
      
  }
  return (
    <>
      {/* add-beat-app works! */}
      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form method="post" onSubmit={save}>
          <div className="mb-6">
            <TextInputField
              label="Beat Name"
              name="beat_name"
              type="text"
              placeholder="Beat Name"
              id="beat_name"
              error={validationErrors["beat_name"]}
              onChange={handleChange}
              required="required"
              value={formData.beat_name}
              semibold_label={true}
            />
          </div>
          <div className="mb-6">
            <div className="mb-2 block">
              <TextareaField
                label="Description"
                id="description"
                name="description"
                placeholder="Leave a description..."
                semibold_label={true}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between">
              <RegularButton
                text="Update Beat"
                rounded="full"
                width="auto"
                padding="px-8 py-2.5"
                textSize="sm"
              />
              <button type="button" onClick={props.cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditBeat;
