import {
  Button,
  Modal,
  Label,
  TextInput,
  Select,
  Radio,
  Datepicker,
} from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import { HiTag } from "react-icons/hi";
import { useGetPointsQuery } from "../../../../redux/services/points";
import { useCreatePatrolMutation } from "../../../../redux/services/patrol";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";

function parseDate(dateString) {
  return new Date(dateString);
}

const PatrolInformationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  points: Yup.array().required("Point count is required"),
  startTime: Yup.string().required("Start Time is required"),
});

const CreatePatrol = ({ openModal, setOpenCreatePatrolModal }) => {
  const { data: points, refetch: refetchPoints } = useGetPointsQuery();

  const [startTime, setStartTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const pointCounts = [
    { value: 1, label: "1 Point" },
    { value: 2, label: "2 Points" },
    { value: 3, label: "3 Points" },
    { value: 4, label: "4 Points" },
    { value: 5, label: "5 Points" },
  ];

  const [selectedPoints, setSelectedPoints] = useState([]);

  useEffect(() => {
    setSelectedPoints(new Array(pointCount).fill(null));
  }, [pointCount]);

  const handlePointSelection = (index, value) => {
    const newSelectedPoints = [...selectedPoints];
    newSelectedPoints[index] = value;

    setSelectedPoints(newSelectedPoints);
    formik.values.points = newSelectedPoints;
  };
  // const allPoints = [
  //   { value: "maingate", label: "Main gate" },
  //   { value: "northfence", label: "North fence" },
  //   { value: "secondarygate", label: "Secondary gate" },
  // ];

  const handlePointCountChange = (value) => {
    setPointCount(value);

    setSelectedPoints(new Array(value).fill(""));
  };

  const [lists, setlists] = useState([]);
  const [createPatrol] = useCreatePatrolMutation();

  const formik = useFormik({
    initialValues: {
      points: "",
      name: "",
    },
    validationSchema: PatrolInformationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const { data } = await createPatrol(values);
        if (true) {
          setOpenCreatePatrolModal(false);
          Swal.fire({
            title: "Patrol Created!",
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

  console.log(formik.errors);
  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    formik.values.startTime = e.target.value;
  };
  return (
    <Modal
      dismissible
      show={openModal}
      onClose={() => setOpenCreatePatrolModal(false)}
    >
      <Modal.Header>Create Patrol</Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Enter Patrol name" />
            </div>
            <TextInput
              {...formik.getFieldProps("name")}
              icon={HiTag}
              id="patrolname"
              type="text"
              required
            />
            {formik.touched.name && formik.errors.name && (
              <div className="mt-1">
                <div className=" text-red-500">{formik.errors.name}</div>
              </div>
            )}
          </div>
          <div className=" flex flex-row justify-between items-center">
            <fieldset className="flex max-w-md flex-col gap-4">
              <legend className="mb-4 font-medium">
                Select patrol points count
              </legend>
              <div className="flex flex-row gap-4">
                {pointCounts.map((action, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Radio
                      key={action.value}
                      value={action.value}
                      style={{ color: "#008080" }}
                      id={action.value}
                      onClick={(event) =>
                        handlePointCountChange(parseInt(event.target.value))
                      }
                      name="pointCount"
                    />
                    <Label htmlFor={action.value}>{action.label}</Label>
                  </div>
                ))}
              </div>
            </fieldset>
            {formik.touched.pointCount && formik.errors.pointCount && (
              <div className="mt-1">
                <div className=" text-red-500">{formik.errors.pointCount}</div>
              </div>
            )}
          </div>
          {Array.from({ length: pointCount }, (_, index) => {
            return (
              <div key={index}>
                <Label
                  htmlFor={`point-${index + 1}`}
                  value={`Point ${index + 1}`}
                />
                <Select
                  required
                  id={`point-${index + 1}`}
                  onChange={(e) => handlePointSelection(index, e.target.value)}
                  value={selectedPoints?.[index] || ""}
                >
                  {selectedPoints[index] === null ||
                  selectedPoints[index] === "" ? (
                    <option value="">Select a point</option>
                  ) : (
                    <option value="">
                      {
                        points.find(
                          (point) => point._id === selectedPoints?.[index]
                        )?.name
                      }
                    </option>
                  )}
                  {points
                    .filter(
                      (point) =>
                        !selectedPoints.some(
                          (selectedPoint) =>
                            selectedPoint === point._id ||
                            selectedPoints.includes(point._id)
                        )
                    )
                    .map((point) => (
                      <option key={point._id} value={point._id}>
                        {point.name}
                      </option>
                    ))}
                </Select>
              </div>
            );
          })}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="startTime" value="Select Patrol Time" />
            </div>
            <input
              className="border-gray-300 rounded-md w-full"
              type="time"
              id="start-time"
              value={startTime}
              onChange={handleStartTimeChange}
            />{" "}
            {formik.touched.startTime && formik.errors.startTime && (
              <div className="mt-1">
                <div className=" text-red-500">{formik.errors.startTime}</div>
              </div>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => formik.handleSubmit()}
          isProcessing={isLoading}
          disabled={isLoading}
          style={{ backgroundColor: "#008080" }}
          type="submit"
        >
          Create Patrol
        </Button>
        <Button color="gray" onClick={() => setOpenCreatePatrolModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePatrol;
