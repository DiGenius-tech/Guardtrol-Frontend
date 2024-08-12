import React, { useState } from "react";
import RegularButton from "../Sandbox/Buttons/RegularButton";
import TextAreaField from "../Sandbox/InputField/TextAreaField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../../redux/selectors/auth";
import { errorHandler } from "../../lib/errorHandler";
import { suspenseHide, suspenseShow } from "../../redux/slice/suspenseSlice";
import { useAddTicketReplyMutation } from "../../redux/services/supportApi";

const replySchema = Yup.object().shape({
  message: Yup.string().required("Message is required"),
});

const TicketReplyForm = ({ ticketId }) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [addReply] = useAddTicketReplyMutation();

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: replySchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await handleReply(values);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleReply = async (values) => {
    dispatch(suspenseShow());
    const data = await addReply({ ticketId, reply: values }).unwrap();

    if (data) {
      formik.resetForm();
    }
    dispatch(suspenseHide());
  };

  return (
    <>
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={formik.handleSubmit} className="max-w-3xl">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="col-span-12">
              <TextAreaField
                label="Message"
                name="message"
                placeholder="Enter Message"
                class="mb-1"
                {...formik.getFieldProps("message")}
                id="message"
                semibold_label={true}
              />
              {formik.touched.message && formik.errors.message && (
                <div className="text-red-500">{formik.errors.message}</div>
              )}
            </div>
          </div>
          <div className="sm:text-right">
            <RegularButton
              disable={loading}
              type={"submit"}
              text="Reply"
              width="auto"
              padding="px-4 py-2"
              textSize="text-sm"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default TicketReplyForm;
