import React, { useState } from 'react';
import TextInputField from '../../../../../Sandbox/InputField/TextInputField';
import RegularButton from '../../../../../Sandbox/Buttons/RegularButton';

const BankDetails = () => {
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState({
        bank: "",
        accountNumber: "",
        accountName: "",
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setValidationErrors({ ...validationErrors, [e.target.name]: "" });
        // console.log("formData: ", formData)
    };
    return (
        <>
            {/* bank-details-app works! */}
            
            <div className="mx-auto max-w-xl">
                <fieldset>
                    <legend className='text-xl font-semibold mb-16 text-center'>Bank account details</legend>
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
                                error={validationErrors['bank']}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <TextInputField
                                label="Account number"
                                semibold_label={true}
                                type="number"
                                id="accountNumber"
                                required="required"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                error={validationErrors['accountNumber']}
                            />
                        </div>
                        <div className="col-span-12">
                            <TextInputField
                                label="Account name"
                                semibold_label={true}
                                type="text"
                                id="accountName"
                                required="required"
                                name="accountName"
                                value={formData.accountName}
                                onChange={handleChange}
                                error={validationErrors['accountName']}
                            />
                        </div>
                    </div>
                    <RegularButton text="Update" />
                </fieldset>
            </div>
        </>
    );
}

export default BankDetails;
