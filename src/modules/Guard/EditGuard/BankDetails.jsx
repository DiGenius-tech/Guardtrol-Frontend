import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../Sandbox/InputField/TextInputField";
import RegularButton from "../../Sandbox/Buttons/RegularButton";

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectAuth, selectToken } from "../../../redux/selectors/auth";
import { patch } from "../../../lib/methods";
import * as Yup from "yup";
import { useFormik } from "formik";

const validationSchema = Yup.object({
  bank: Yup.string().required("Bank is required"),
  accountname: Yup.string().required("Account name is required"),
  accountnumber: Yup.string().required("Account number is required"),
});

const BankDetails = (props) => {
  const { guardId } = useParams();
  const auth = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);

  const token = useSelector(selectToken);
  // const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  // const [formData, setFormData] = useState({
  //   bank: "",
  //   accountnumber: "",
  //   accountname: "",
  // });

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  //   setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  // };

  // const save = async (e) => {
  //   try {
  //     setLoading(true);
  //     e.preventDefault();
  //     if (formData.accountnumber.length !== 10) {
  //       setValidationErrors({
  //         ...validationErrors,
  //         accountnumber: "Account number should be 10 digits",
  //       });
  //       return;
  //     }
  //     const data = patch(`guard/banking/${guardId}`, formData, token).then(
  //       (data) => {
  //         if (data.status) {
  //           toast("Banking Information Updated");
  //           //props.setGuard({})
  //         }
  //       }
  //     );
  //   } catch (error) {
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const formik = useFormik({
    initialValues: {
      bank: props.guard?.bank,
      accountname: props.guard?.accountname,
      accountnumber: props.guard?.accountnumber,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const data = await patch(
          `guard/banking/${guardId}`,
          values,
          token
        ).then((data) => {
          if (data.status) {
            toast("Banking Information Updated");
            //props.setGuard({})
          }
        });
      } catch (error) {
        toast.error("Error updating personal information");
      } finally {
        setLoading(false);
      }
    },
  });

  // useEffect(() => {
  //   formik.setValues({
  //     bank: props.guard?.bank,
  //     accountname: props.guard?.accountname,
  //     accountnumber: props.guard?.accountnumber,
  //   });
  // }, []);
  return (
    <>
      {/* bank-details-app works! */}

      <form onSubmit={formik.handleSubmit}>
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-8 text-center">
              Bank Account Details
            </legend>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Bank"
                  type="text"
                  id="bank"
                  {...formik.getFieldProps("bank")}
                  error={formik.errors.bank}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Account Number"
                  type="text"
                  id="accountnumber"
                  {...formik.getFieldProps("accountnumber")}
                  error={formik.errors.accountnumber}
                />
              </div>
              <div className="col-span-12">
                <TextInputField
                  type="text"
                  label="Account Name"
                  {...formik.getFieldProps("accountname")}
                  id="accountname"
                  error={formik.errors.accountname}
                />
              </div>
            </div>
            <RegularButton
              disabled={loading}
              isLoading={loading}
              text="Update"
            />
          </fieldset>
        </div>
      </form>
    </>
  );
};

export default BankDetails;
