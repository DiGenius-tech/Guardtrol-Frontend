import { useEffect, useState } from "react";
import TextInputField from "../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../Sandbox/Buttons/RegularButton";
import TextareaField from "../../../../Sandbox/TextareaField/TextareaField";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  useGetBeatsQuery,
  useUpdateBeatMutation,
} from "../../../../../redux/services/beats";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectUser,
} from "../../../../../redux/selectors/auth";
import {
  suspenseHide,
  suspenseShow,
} from "../../../../../redux/slice/suspenseSlice";

function EditBeat(props) {
  const [validationErrors, setValidationErrors] = useState({});
  const [preBeat, setPreBeat] = useState("");
  const navigate = useNavigate();

  const organization = useSelector(selectOrganization);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { refetch: refetchBeats } = useGetBeatsQuery(
    { organization },
    {
      skip: organization ? false : true,
    }
  );
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    address: "",
    description: "",
  });
  const [updateBeat, { isLoading }] = useUpdateBeatMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  useEffect(() => {
    setFormData({
      _id: props?.selectedBeat._id,
      name: props?.selectedBeat.name,
      address: props?.selectedBeat.address,
      description: props?.selectedBeat.description,
    });
    setPreBeat(props.selectedBeat.name);
  }, [props]);

  const save = async (e) => {
    e.preventDefault();

    if (formData.name === "" || formData.name.length < 3) {
      setValidationErrors({
        ...validationErrors,
        beat_name: "Use A Valid Beat Name",
      });
    } else {
      dispatch(suspenseShow());
      await updateBeat({ body: formData, userid: user?.userid }).then(
        toast("Beat Updated")
      );
      await refetchBeats();
      dispatch(suspenseHide());

      props.cancelEdit();
    }
  };

  return (
    <>
      {/* add-beat-app works! */}
      <div className="max-w-md mx-auto block px-4 py-8 sm:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <form method="post" onSubmit={save}>
          <div className="mb-6">
            <TextInputField
              label="Beat Name"
              name="name"
              type="text"
              placeholder="Beat Name"
              id="name"
              error={validationErrors["name"]}
              onChange={handleChange}
              required="required"
              value={formData.name}
              semibold_label={true}
            />
          </div>
          <div className="mb-6">
            <TextInputField
              label="Beat Address"
              name="address"
              type="text"
              placeholder="Beat Address"
              id="address"
              error={validationErrors["address"]}
              onChange={handleChange}
              required="required"
              value={formData.address}
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
                disabled={isLoading}
                isLoading={isLoading}
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
