import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../Sandbox/Buttons/RegularButton";
import useHttpRequest from "../../../../shared/Hooks/HttpRequestHook";

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectAuth, selectToken } from "../../../../redux/selectors/auth";
import { patch } from "../../../../lib/methods";

const BankDetails = (props) => {
  const { guardId } = useParams();
  const auth = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);

  const token = useSelector(selectToken);
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    bank: "",
    accountnumber: "",
    accountname: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
  };

  useEffect(() => {
    setFormData({
      bank: props.guard?.bank,
      accountname: props.guard?.accountname,
      accountnumber: props.guard?.accountnumber,
    });
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const save = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (formData.accountnumber.length !== 10) {
        setValidationErrors({
          ...validationErrors,
          accountnumber: "Account number should be 10 digits",
        });
        return;
      }
      const data = patch(`guard/banking/${guardId}`, formData, token).then(
        (data) => {
          if (data.status) {
            toast("Banking Information Updated");
            //props.setGuard({})
          }
        }
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* bank-details-app works! */}

      <form onSubmit={save}>
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-8 text-center">
              Bank Account Details
            </legend>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Bank"
                  semibold_label={true}
                  type="text"
                  id="bank"
                  required="required"
                  name="bank"
                  value={formData.bank}
                  onChange={handleChange}
                  error={validationErrors["bank"]}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <TextInputField
                  label="Account Number"
                  semibold_label={true}
                  type="number"
                  id="accountnumber"
                  required="required"
                  name="accountnumber"
                  value={formData.accountnumber}
                  onChange={handleChange}
                  error={validationErrors["accountnumber"]}
                />
              </div>
              <div className="col-span-12">
                <TextInputField
                  label="Account Name"
                  semibold_label={true}
                  type="text"
                  id="accountname"
                  required="required"
                  name="accountname"
                  value={formData.accountname}
                  onChange={handleChange}
                  error={validationErrors["accountname"]}
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
