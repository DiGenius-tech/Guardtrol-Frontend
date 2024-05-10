import {
  Button,
  Modal,
  Label,
  TextInput,
  Select,
  Radio,
  FileInput,
} from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { HiMap, HiTag } from "react-icons/hi";
import { useCreatePointsMutation } from "../../../../redux/services/points";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";

const PointInformationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  coordinates: Yup.string().required("Coordinates is required"),
  imageUrl: Yup.string().required("ImageUrl is required"),
});

const CreatePoint = ({ openModal, setOpenCreatePointModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createPoint] = useCreatePointsMutation();

  const formik = useFormik({
    initialValues: {
      coordinates: "",
      name: "",
      imageUrl: "",
    },
    validationSchema: PointInformationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        console.log(values);
        const { data } = await createPoint(values);
        if (data) {
          setOpenCreatePointModal(false);
          Swal.fire({
            title: "Point Created!",
            icon: "success",
            confirmButtonColor: "#008080",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Modal
      dismissible
      show={openModal}
      onClose={() => setOpenCreatePointModal(false)}
    >
      <Modal.Header>Create Point</Modal.Header>
      <Modal.Body>
        <form
          method="post"
          className="space-y-6"
          onSubmit={formik.handleSubmit}
        >
          <div id="fileUpload">
            <div className="mb-2 block">
              <Label htmlFor="file" value="Select point Image" />
            </div>
            <FileInput
              id="file"
              {...formik.getFieldProps("imageUrl")}
              className=" placeholder-red-900"
              helperText="Select image that shows the Point"
            />
            {formik.touched.imageUrl && formik.errors.imageUrl && (
              <div className="mt-1">
                <div className=" text-red-500">{formik.errors.imageUrl}</div>
              </div>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="pointname" value="Enter Point name" />
            </div>
            <TextInput
              {...formik.getFieldProps("name")}
              icon={HiTag}
              id="pointname"
              type="text"
              required
            />
            {formik.touched.name && formik.errors.name && (
              <div className="mt-1">
                <div className=" text-red-500">{formik.errors.name}</div>
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="coordinates" value="Enter Point Coordinate" />
            </div>

            <TextInput
              {...formik.getFieldProps("coordinates")}
              icon={HiMap}
              id="coordinates"
              type="text"
              required
            />
            {formik.touched.coordinates && formik.errors.coordinates && (
              <div className="mt-1">
                <div className=" text-red-500">{formik.errors.coordinates}</div>
              </div>
            )}
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          isProcessing={isLoading}
          disabled={isLoading}
          onClick={() => formik.handleSubmit()}
          style={{ backgroundColor: "#008080" }}
          type="submit"
        >
          Create Point
        </Button>
        <Button color="gray" onClick={() => setOpenCreatePointModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default CreatePoint;
