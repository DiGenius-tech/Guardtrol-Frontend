import React, { useContext, useEffect, useState } from "react";
import TextInputField from "../../../../../Sandbox/InputField/TextInputField";
import RegularButton from "../../../../../Sandbox/Buttons/RegularButton";
import useHttpRequest from "../../../../../../shared/Hooks/HttpRequestHook";
import { AuthContext } from "../../../../../../shared/Context/AuthContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BankDetails = (props) => {
  const {guardId} = useParams()
  const auth = useContext(AuthContext)
  const { isLoading, error, responseData, sendRequest } = useHttpRequest();
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    bank: "",
    accountnumber: "",
    accountname: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    // console.log("formData: ", formData)
  };

  useEffect(()=>{
    setFormData({
      bank: props.guard?.bank,
      accountname: props.guard?.accountname,
      accountnumber: props.guard?.accountnumber,
    })
  }, [props])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const save = async (e) => {
    e.preventDefault()
    
   
    
    
    const data = sendRequest(
      `http://localhost:5000/api/guard/banking/${guardId}`,
      'PATCH',
      JSON.stringify(formData),
      {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${auth.token}`,
      }
    ).then(data => {
      if(data.status){
        toast("Banking Information Updated")
        //props.setGuard({})
        props.handleSentRequest()
      }
    })
  }
  return (
    <>
      {/* bank-details-app works! */}

      <form onSubmit={save}>
        <div className="mx-auto max-w-xl">
          <fieldset>
            <legend className="text-xl font-semibold mb-8 text-center">
              Bank account details
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
            <RegularButton text="Update" />
          </fieldset>
        </div>
      </form>
    </>
  );
};

export default BankDetails;
