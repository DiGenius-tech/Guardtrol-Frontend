import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrganization,
  selectToken,
  selectUser,
} from "../../../redux/selectors/auth";
import {
  useAddTicketMutation,
  useGetTicketsCategoriesQuery,
} from "../../../redux/services/support";
import RegularButton from "../../Sandbox/Buttons/RegularButton";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import { suspenseHide, suspenseShow } from "../../../redux/slice/suspenseSlice";
import TextareaField from "../../Sandbox/TextareaField/TextareaField";
import { errorHandler } from "../../../lib/errorHandler";
import { Button, Spinner, Select } from "flowbite-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ticketSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
});

const SubmitTicketForm = () => {
  const [loading, setLoading] = useState(false);
  const organization = useSelector(selectOrganization);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [addTicket, addTicketDetails] = useAddTicketMutation();
  const { data: ticketCategories, isLoading: isCategoriesLoading } =
    useGetTicketsCategoriesQuery();

  const formik = useFormik({
    initialValues: {
      subject: "",
      description: "",
      category: "",
    },
    validationSchema: ticketSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await handleSubmitTicket(values);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSubmitTicket = async (values) => {
    dispatch(suspenseShow());
    console.log(values);
    const data = await addTicket({ organization, data: values }).unwrap();
    console.log(data);

    if (data) {
      toast("Ticket has been submitted");
      navigate(-1);
      formik.resetForm();
    }

    dispatch(suspenseHide());
  };

  return (
    <>
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="col-span-6">
              <TextInputField
                label="Subject"
                name="subject"
                type="text"
                placeholder="Enter Subject"
                class="mb-1"
                {...formik.getFieldProps("subject")}
                id="subject"
                semibold_label={true}
              />
              {formik.touched.subject && formik.errors.subject && (
                <div className="text-red-500">{formik.errors.subject}</div>
              )}
            </div>
            <div className="col-span-6">
              <label
                className={`block mb-2  text-gray-900 font-medium  dark:text-white cursor-pointer`}
              >
                Category
              </label>
              <Select
                label="Category"
                name="category"
                id="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mb-1"
                required
              >
                <option value="">Select Category</option>
                {ticketCategories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <div className="text-red-500">{formik.errors.category}</div>
              )}
            </div>
            <div className="col-span-12">
              <TextareaField
                label="Description"
                name="description"
                placeholder="Enter Description"
                class="mb-1"
                {...formik.getFieldProps("description")}
                id="description"
                semibold_label={true}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500">{formik.errors.description}</div>
              )}
            </div>
          </div>
          <div className="sm:text-right mt-5">
            <Button
              disabled={addTicketDetails.isLoading}
              className="bg-[#008080] "
              type={"submit"}
            >
              {"Create"}
              {addTicketDetails.isLoading && (
                <Spinner
                  aria-label="Loading spinner"
                  className="ml-2"
                  color="success"
                />
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SubmitTicketForm;
